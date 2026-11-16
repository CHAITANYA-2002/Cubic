import { useState, type FormEvent } from "react";
import { ROLE_LABELS } from "@shared/team";
import { osFetch, useOsMutation } from "@/lib/os-api";
import { useMe } from "@/lib/workspace-api";
import { AvailabilityEditor } from "./CallsSettings";
import { Actions, Field, FormError, inputClass, Panel, primaryButton } from "./ui";

function Profile() {
  const me = useMe();
  const [name, setName] = useState(me.name);
  const [email, setEmail] = useState(me.email);
  const save = useOsMutation(() => osFetch("PUT", "/api/os/me", { name, email }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(undefined);
  };
  return (
    <Panel title={`Profile · ${ROLE_LABELS[me.role]}`}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name" hint="Shown on leads, tasks, calls and the booking page"><input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></Field>
        <Field label="Email" hint={me.role === "owner" ? "Optional for the owner; you can still sign in with the email field blank" : "Your sign-in email"}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <FormError error={save.error} />
        <Actions><button disabled={save.isPending} className={primaryButton}>{save.isSuccess ? "Saved ✓" : "Save profile"}</button></Actions>
      </form>
    </Panel>
  );
}

function Password() {
  const me = useMe();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const save = useOsMutation(() => osFetch("POST", "/api/admin/password", { current, next }));
  if (me.role === "owner") {
    return (
      <Panel title="Password">
        <p className="text-sm t-muted">The owner password is the Cloudflare secret ADMIN_PASSWORD. Change it on your computer with <code className="t-secondary">npm run admin:password</code>.</p>
      </Panel>
    );
  }
  const submit = (event: FormEvent) => {
    event.preventDefault();
    save.mutate(undefined, { onSuccess: () => { setCurrent(""); setNext(""); } });
  };
  return (
    <Panel title="Change password">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Current password"><input type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass} /></Field>
        <Field label="New password" hint="At least 10 characters. Other devices are signed out."><input type="password" autoComplete="new-password" minLength={10} required value={next} onChange={(e) => setNext(e.target.value)} className={inputClass} /></Field>
        <FormError error={save.error} />
        <Actions><button disabled={save.isPending} className={primaryButton}>{save.isSuccess ? "Changed ✓" : "Change password"}</button></Actions>
      </form>
    </Panel>
  );
}

export default function AccountView() {
  return (
    <div className="space-y-6">
      <header>
        <p className="label mb-2">You</p>
        <h1 className="text-3xl t-primary">My account</h1>
      </header>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <Profile />
          <Password />
        </div>
        <AvailabilityEditor />
      </div>
    </div>
  );
}
