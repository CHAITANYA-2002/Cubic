import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { CalendarCheck, MessageCircle, Send, UserRound, X } from "lucide-react";
import { useI18n } from "@/i18n";
import { useSite } from "@/lib/site";

type Message = { role: "user" | "assistant"; content: string };
const SESSION_KEY = "cubic.chat";

function sessionId(): string {
  const make = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return (JSON.parse(stored) as { id: string }).id;
  } catch {
    // ignore
  }
  return make();
}

function restore(): Message[] {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? ((JSON.parse(stored) as { messages: Message[] }).messages ?? []) : [];
  } catch {
    return [];
  }
}

/**
 * Renders the assistant's text safely: plain text with [label](url) links. Only site paths,
 * https, mailto and tel links become anchors; everything else stays text. No HTML is ever injected.
 */
function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]{1,80})\]\(((?:\/[\w\-/#?=&.]*)|(?:https:\/\/[^\s)]+)|(?:mailto:[^\s)]+)|(?:tel:[+\d\s-]+))\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[3]) parts.push(<strong key={match.index}>{match[3]}</strong>);
    else if (match[2].startsWith("/")) parts.push(<Link key={match.index} href={match[2]} className="underline underline-offset-2">{match[1]}</Link>);
    else parts.push(<a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{match[1]}</a>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <p className="whitespace-pre-line">{parts}</p>;
}

function LeadForm({ session, onDone }: { session: string; onDone: () => void }) {
  const { t } = useI18n();
  const c = t.chat;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/chat/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, sessionId: session }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof body.message === "string" ? body.message : c.error);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : c.error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-2 rounded-xl border border-[var(--line)] p-3">
      <p className="text-sm font-medium t-primary">{c.leadTitle}</p>
      <input name="name" required minLength={2} placeholder={c.leadName} aria-label={c.leadName} autoComplete="name" className="field !min-h-10 !py-2 !text-sm" />
      <input name="email" type="email" required placeholder={c.leadEmail} aria-label={c.leadEmail} autoComplete="email" dir="ltr" className="field !min-h-10 !py-2 !text-sm" />
      <input name="phone" type="tel" placeholder={c.leadPhone} aria-label={c.leadPhone} autoComplete="tel" dir="ltr" className="field !min-h-10 !py-2 !text-sm" />
      <input name="message" placeholder={c.leadMessage} aria-label={c.leadMessage} className="field !min-h-10 !py-2 !text-sm" />
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {error && <p role="alert" className="text-xs text-[hsl(var(--destructive))]">{error}</p>}
      <button disabled={busy} className="btn btn-primary !min-h-10 w-full">{c.leadSubmit}</button>
    </form>
  );
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale, dir } = useI18n();
  const { site } = useSite();
  const c = t.chat;
  const [session] = useState(sessionId);
  const [messages, setMessages] = useState<Message[]>(restore);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [offerContact, setOfferContact] = useState(false);
  const [leadState, setLeadState] = useState<"closed" | "open" | "sent">("closed");
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: session, messages: messages.slice(-40) }));
    } catch {
      // Storage blocked: the chat simply starts fresh next time.
    }
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, session, leadState]);

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function ask(text: string) {
    const question = text.trim().slice(0, 1000);
    if (!question || busy) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session, message: question, locale, page: window.location.pathname }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof body.message === "string" ? body.message : c.error);
      setMessages((prev) => [...prev, { role: "assistant", content: String(body.reply ?? "") }]);
      if (body.suggestContact) setOfferContact(true);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: err instanceof Error ? err.message : c.error }]);
      setOfferContact(true);
    } finally {
      setBusy(false);
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  return (
    <section
      id="cubic-chat"
      role="dialog"
      aria-modal="false"
      aria-label={c.title}
      dir={dir}
      hidden={!open}
      className="fixed inset-x-3 bottom-20 z-[55] flex max-h-[min(640px,calc(100dvh-7rem))] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.75)] sm:inset-x-auto sm:end-5 sm:w-[390px]"
    >
      <header className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
        <div>
          <p className="font-semibold t-primary">{c.title}</p>
          <p className="text-xs t-muted">{c.subtitle}</p>
        </div>
        <button type="button" onClick={onClose} aria-label={c.close} className="rounded-full p-1.5 t-muted hover:t-primary"><X className="h-4 w-4" /></button>
      </header>

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm" aria-live="polite">
        <div className="max-w-[88%] rounded-2xl bg-[var(--surface)] px-3.5 py-2.5 t-secondary">{c.greeting}</div>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {c.suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => void ask(suggestion)} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs t-secondary hover:border-[var(--line-strong)]">
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${message.role === "user" ? "ms-auto bg-[#f5f5f7] text-black" : "bg-[var(--surface)] t-secondary"}`}>
            {message.role === "assistant" ? <RichText text={message.content} /> : <p className="whitespace-pre-line">{message.content}</p>}
          </div>
        ))}
        {busy && <p className="text-xs t-muted">{c.thinking}</p>}
        {(offerContact || messages.length >= 4) && leadState === "closed" && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Link href="/book" onClick={onClose} className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-3 py-1.5 text-xs font-medium text-black"><CalendarCheck className="h-3.5 w-3.5" />{c.bookCall}</Link>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs t-secondary"><MessageCircle className="h-3.5 w-3.5" />{c.whatsapp}</a>
            <button type="button" onClick={() => setLeadState("open")} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs t-secondary"><UserRound className="h-3.5 w-3.5" />{c.leaveDetails}</button>
          </div>
        )}
        {leadState === "open" && <LeadForm session={session} onDone={() => setLeadState("sent")} />}
        {leadState === "sent" && <p role="status" className="rounded-xl bg-[var(--success-soft)] p-3 text-sm t-primary">{c.leadThanks}</p>}
      </div>

      <form onSubmit={submit} className="border-t border-[var(--line)] p-3">
        <div className="flex items-center gap-2">
          <input
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
            placeholder={c.placeholder}
            aria-label={c.placeholder}
            className="field !min-h-11 flex-1 !py-2 !text-sm"
          />
          <button disabled={busy || !input.trim()} aria-label={c.send} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-black disabled:opacity-40">
            <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 text-[10.5px] leading-snug t-muted">{c.disclaimer}</p>
      </form>
    </section>
  );
}
