import { useEffect, useState, type FormEvent } from "react";
import type { ChatbotSettings, KbEntry } from "@shared/crm";
import { osFetch, useOsMutation } from "@/lib/os-api";
import { useChatbot, useKb } from "@/lib/workspace-api";
import { Actions, Badge, dangerButton, Empty, Field, FormError, ghostButton, inputClass, Modal, Panel, primaryButton, Stat } from "./ui";

function EntryForm({ entry, onClose }: { entry: KbEntry | null; onClose: () => void }) {
  const [draft, setDraft] = useState({ question: entry?.question ?? "", answer: entry?.answer ?? "", tags: entry?.tags ?? "", active: entry?.active ?? true });
  const save = useOsMutation(() => (entry ? osFetch("PATCH", `/api/os/kb/${entry.id}`, draft) : osFetch("POST", "/api/os/kb", draft)));
  const remove = useOsMutation(() => osFetch("DELETE", `/api/os/kb/${entry?.id}`));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(undefined, { onSuccess: onClose });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Question visitors ask"><input required value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} className={inputClass} placeholder="Do you build Shopify stores?" /></Field>
      <Field label="The answer the bot should give" hint="Write facts only. The bot answers in the visitor's language.">
        <textarea required rows={5} value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} className={inputClass} />
      </Field>
      <Field label="Keywords (optional)" hint="Other words people use, e.g. ecommerce, online store"><input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} className={inputClass} /></Field>
      <label className="flex items-center gap-2 text-sm t-secondary"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Active</label>
      <FormError error={save.error || remove.error} />
      <Actions>
        {entry && <button type="button" onClick={() => confirm("Delete this answer?") && remove.mutate(undefined, { onSuccess: onClose })} className={dangerButton}>Delete</button>}
        <button disabled={save.isPending} className={primaryButton}>Save answer</button>
      </Actions>
    </form>
  );
}

function TryIt() {
  const [question, setQuestion] = useState("How much does a website cost?");
  const ask = useOsMutation(() => osFetch<{ reply: string; sources: string[] }>("POST", "/api/os/chatbot/test", { message: question }));
  return (
    <Panel title="Try the assistant">
      <form onSubmit={(e) => { e.preventDefault(); ask.mutate(undefined); }} className="flex gap-2">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} className={inputClass} aria-label="Test question" />
        <button disabled={ask.isPending} className={primaryButton}>{ask.isPending ? "…" : "Ask"}</button>
      </form>
      <FormError error={ask.error} />
      {ask.data && (
        <div className="mt-4 space-y-2 text-sm">
          <p className="whitespace-pre-line t-secondary">{ask.data.reply}</p>
          <p className="text-[11px] t-muted">Used: {ask.data.sources.join(" · ")}</p>
        </div>
      )}
    </Panel>
  );
}

function BotSettings() {
  const { data } = useChatbot();
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  useEffect(() => {
    if (data && !settings) setSettings(data.settings);
  }, [data, settings]);
  const save = useOsMutation(() => osFetch("PUT", "/api/os/chatbot", settings));
  if (!settings || !data) return <Panel title="Assistant settings"><p className="text-sm t-muted">Loading…</p></Panel>;
  return (
    <Panel title="Assistant settings">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Stat label="Answers today" value={`${data.usedToday} / ${settings.dailyLimit}`} />
        <Stat label="AI model" value={data.aiConnected ? "Connected" : "Not connected"} tone={data.aiConnected ? "good" : "warn"} hint={data.aiConnected ? "Cloudflare Workers AI" : "Falls back to FAQ answers"} />
      </div>
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm t-secondary"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show the assistant on the website</label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="AI answers per day (whole site)"><input type="number" value={settings.dailyLimit} onChange={(e) => setSettings({ ...settings, dailyLimit: Number(e.target.value) })} className={inputClass} /></Field>
          <Field label="Questions per visitor per day"><input type="number" value={settings.perVisitorLimit} onChange={(e) => setSettings({ ...settings, perVisitorLimit: Number(e.target.value) })} className={inputClass} /></Field>
        </div>
        <Field label="Extra instructions" hint="e.g. 'We are fully booked until March; offer the waiting list.' Facts only — the bot repeats this.">
          <textarea rows={3} value={settings.extraInstructions} onChange={(e) => setSettings({ ...settings, extraInstructions: e.target.value })} className={inputClass} />
        </Field>
      </div>
      <FormError error={save.error} />
      <Actions><button onClick={() => save.mutate(undefined)} disabled={save.isPending} className={primaryButton}>{save.isSuccess ? "Saved ✓" : "Save settings"}</button></Actions>
    </Panel>
  );
}

export default function KnowledgeView() {
  const { data: entries = [], isLoading } = useKb();
  const [editing, setEditing] = useState<KbEntry | null | "new">(null);
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Website assistant</p>
          <h1 className="text-3xl t-primary">Chatbot</h1>
          <p className="mt-2 max-w-2xl text-sm t-muted">The assistant already knows every service, price, FAQ, project and your contact details from the website. Add answers here for anything else visitors ask.</p>
        </div>
        <button onClick={() => setEditing("new")} className={primaryButton}>Add an answer</button>
      </header>
      <div className="grid gap-6 xl:grid-cols-2">
        <BotSettings />
        <TryIt />
      </div>
      <Panel title={`Answers you taught (${entries.length})`}>
        {isLoading ? (
          <p className="text-sm t-muted">Loading…</p>
        ) : entries.length === 0 ? (
          <Empty>None yet. Check Chats for questions the bot could not answer, then add them here.</Empty>
        ) : (
          <ul className="divide-y divide-white/5">
            {entries.map((entry) => (
              <li key={entry.id}>
                <button onClick={() => setEditing(entry)} className="w-full py-3 text-left">
                  <p className="flex items-center gap-2 text-sm t-primary">{entry.question} {!entry.active && <Badge>Off</Badge>}</p>
                  <p className="mt-1 line-clamp-2 text-xs t-muted">{entry.answer}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Teach a new answer" : "Edit answer"} wide>
        {editing !== null && <EntryForm entry={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      </Modal>
      <p className="text-xs t-muted">Tip: <button onClick={() => setEditing("new")} className={`${ghostButton} !px-2 !py-0.5`}>Add</button> answers for your process, tools you use, industries you serve and anything you are often asked on calls.</p>
    </div>
  );
}
