import { useEffect, useState, type FormEvent } from "react";
import type { Settings } from "@shared/os";
import { getToken, osFetch, useOsMutation, useOsState } from "@/lib/os-api";
import { Actions, Field, FormError, ghostButton, inputClass, Panel, primaryButton } from "./ui";

type TextKey = { [K in keyof Settings]: Settings[K] extends string ? K : never }[keyof Settings];

const groups: Array<{ title: string; hint?: string; fields: Array<[TextKey, string, string?]> }> = [
  {
    title: "Business identity",
    hint: "Printed on every invoice and quote.",
    fields: [
      ["businessName", "Trading name"],
      ["legalName", "Legal entity name", "Proprietorship, OPC or Pvt Ltd name as registered"],
      ["gstin", "GSTIN", "Leave blank if not GST-registered — then do not charge GST"],
      ["pan", "PAN"],
      ["email", "Billing email"],
      ["phone", "Phone"],
      ["website", "Website"],
    ],
  },
  {
    title: "Payment details",
    hint: "Shown on invoices and in the client portal.",
    fields: [
      ["upiId", "UPI ID"],
      ["bankName", "Bank"],
      ["accountName", "Account holder name"],
      ["accountNumber", "Account number"],
      ["ifsc", "IFSC"],
    ],
  },
];

export default function SettingsView() {
  const { data } = useOsState();
  const [draft, setDraft] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const save = useOsMutation((body: Settings) => osFetch<Settings>("PUT", "/api/os/settings", body));

  useEffect(() => {
    if (data && !draft) setDraft(data.settings);
  }, [data, draft]);

  if (!draft) return <p className="t-muted">Loading…</p>;
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSaved(false);
    setDraft({ ...draft, [key]: value });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(draft, { onSuccess: () => setSaved(true) });
  };

  async function downloadBackup() {
    const res = await fetch("/api/os/export", { headers: { "x-admin-token": getToken() } });
    const url = URL.createObjectURL(await res.blob());
    Object.assign(document.createElement("a"), { href: url, download: `cubic-os-backup-${new Date().toISOString().slice(0, 10)}.json` }).click();
    URL.revokeObjectURL(url);
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <header>
        <p className="label mb-2">Firm</p>
        <h1 className="text-3xl t-primary">Settings</h1>
      </header>

      {groups.map((group) => (
        <Panel key={group.title} title={group.title}>
          {group.hint && <p className="mb-4 text-xs t-muted">{group.hint}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map(([key, label, hint]) => (
              <Field key={key} label={label} hint={hint}>
                <input value={draft[key]} onChange={(e) => set(key, e.target.value)} className={inputClass} />
              </Field>
            ))}
          </div>
        </Panel>
      ))}

      <Panel title="Invoicing">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Invoice number prefix" hint="e.g. CT → CT-2026-001"><input value={draft.invoicePrefix} onChange={(e) => set("invoicePrefix", e.target.value)} className={inputClass} /></Field>
          <Field label="Default payment terms (days)"><input type="number" min={0} value={draft.paymentTermsDays} onChange={(e) => set("paymentTermsDays", Number(e.target.value))} className={inputClass} /></Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Business address"><textarea rows={3} value={draft.address} onChange={(e) => set("address", e.target.value)} className={inputClass} /></Field>
          <Field label="Invoice footer"><input value={draft.invoiceFooter} onChange={(e) => set("invoiceFooter", e.target.value)} className={inputClass} /></Field>
        </div>
      </Panel>

      <FormError error={save.error} />
      <Actions>
        <button type="button" onClick={downloadBackup} className={ghostButton}>Download backup (JSON)</button>
        <button disabled={save.isPending} className={primaryButton}>{saved ? "Saved ✓" : save.isPending ? "Saving…" : "Save settings"}</button>
      </Actions>
    </form>
  );
}
