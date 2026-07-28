import { useMutation } from "@tanstack/react-query";
import { api, type InsertConsultationRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

/**
 * Web3Forms access key. Set VITE_WEB3FORMS_KEY in the deploy environment
 * (Vercel/Netlify) and every submission is emailed straight to the inbox that
 * key is registered to — no server or database required, so the site can be
 * deployed as pure static files.
 *
 * When the key is absent (local dev), we fall back to the Express API so the
 * form keeps working against the local backend.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

async function submitViaWeb3Forms(data: InsertConsultationRequest) {
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
      message: data.message,
      // Honeypot support (Web3Forms ignores empty botcheck)
      botcheck: "",
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.success === false) {
    throw new Error(body?.message || "Failed to send your message. Please try again.");
  }
  return body;
}

async function submitViaApi(data: InsertConsultationRequest) {
  const res = await fetch(api.contact.submit.path, {
    method: api.contact.submit.method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 400) {
      const error = api.contact.submit.responses[400].parse(await res.json());
      throw new Error(error.message);
    }
    throw new Error("Failed to submit request");
  }
  return res.json();
}

export function useSubmitContact() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertConsultationRequest) => {
      // Validate before sending, regardless of destination
      const validated = api.contact.submit.input.parse(data);
      return WEB3FORMS_KEY ? submitViaWeb3Forms(validated) : submitViaApi(validated);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "Thanks for reaching out — we'll get back to you shortly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't send your message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
