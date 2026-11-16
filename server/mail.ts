import type { Bindings } from "./env";

type Mail = { to: string; subject: string; text: string; replyTo?: string };

export const mailConfigured = (env: Bindings) => Boolean(env.RESEND_API_KEY && env.MAIL_FROM);

/**
 * Sends through Resend when RESEND_API_KEY and MAIL_FROM are set; otherwise does nothing. Mail is
 * best-effort: a failure is logged and never fails the request that triggered it.
 */
export async function sendMail(env: Bindings, mail: Mail): Promise<void> {
  if (!mailConfigured(env) || !mail.to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.MAIL_FROM, to: [mail.to], subject: mail.subject, text: mail.text, reply_to: mail.replyTo }),
    });
    if (!res.ok) console.error("[mail] send failed", res.status);
  } catch (error) {
    console.error("[mail] send failed", error instanceof Error ? error.message : error);
  }
}

/** Alert the team inbox (NOTIFY_EMAIL) about something that just happened. */
export const notifyTeam = (env: Bindings, subject: string, text: string, replyTo?: string) =>
  sendMail(env, { to: env.NOTIFY_EMAIL ?? "", subject, text, replyTo });
