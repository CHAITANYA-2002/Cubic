import { useMutation } from "@tanstack/react-query";
import { api, type InsertConsultationRequest } from "@shared/routes";

/**
 * Every enquiry is posted to /api/contact so it lands in the admin Inbox (Cloudflare D1).
 * When VITE_WEB3FORMS_KEY is set it is ALSO sent to Web3Forms, which emails it to the inbox the
 * key is registered to. The two run independently: the submission succeeds when either one
 * accepts it, so a Web3Forms outage never loses the stored lead and vice versa.
 *
 * The form renders its own success / error states from the returned mutation.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const GENERIC_ERROR = "Failed to send your message. Please try again.";

/** A rejection the visitor can fix (validation, rate limit) — shown as-is instead of the generic text. */
class UserFacingError extends Error {}

async function submitViaWeb3Forms(data: InsertConsultationRequest): Promise<void> {
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `New enquiry from ${data.name} — CubicTech`,
      from_name: "CubicTech Website",
      // Reply-To so hitting reply in Gmail answers the sender directly
      replyto: data.email,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      budget: data.budget,
      message: data.message,
      // Honeypot: the real value from the hidden form field; Web3Forms drops non-empty ones.
      botcheck: data.botcheck ?? "",
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) throw new Error(body?.message || GENERIC_ERROR);
}

async function submitViaApi(data: InsertConsultationRequest): Promise<void> {
  const res = await fetch(api.contact.submit.path, {
    method: api.contact.submit.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.ok) return;
  if (res.status === 400 || res.status === 429) {
    const parsed = api.contact.submit.responses[400].safeParse(await res.json().catch(() => ({})));
    throw new UserFacingError(parsed.success ? parsed.data.message : GENERIC_ERROR);
  }
  throw new Error(GENERIC_ERROR);
}

async function submitEverywhere(data: InsertConsultationRequest): Promise<void> {
  const attempts = [submitViaApi(data), ...(WEB3FORMS_KEY ? [submitViaWeb3Forms(data)] : [])];
  const results = await Promise.allSettled(attempts);
  if (results.some((result) => result.status === "fulfilled")) return;

  const reasons = results.map((result) => (result as PromiseRejectedResult).reason);
  const fixable = reasons.find((reason) => reason instanceof UserFacingError);
  throw fixable ?? new Error(GENERIC_ERROR);
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: InsertConsultationRequest) => {
      // Validate before sending, regardless of destination.
      const validated = api.contact.submit.input.parse(data);
      await submitEverywhere(validated);
    },
  });
}
