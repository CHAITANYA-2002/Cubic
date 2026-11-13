import { useState, type FormEvent } from "react";
import { Link, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, Briefcase, FileText, FolderKanban, Globe, Inbox, LogOut, Mail, Settings as SettingsIcon, Users } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { signIn, signOut, useAdminSession, useNoIndex } from "@/lib/os-api";
import DashboardView from "./os/Dashboard";
import LeadsView from "./os/Leads";
import PipelineView from "./os/Pipeline";
import ClientsView from "./os/Clients";
import ProjectsView from "./os/Projects";
import InvoicesView from "./os/Invoices";
import SettingsView from "./os/Settings";
import SiteView from "./os/site/SiteView";
import SubscribersView from "./os/Subscribers";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, view: DashboardView },
  { id: "leads", label: "Inbox", icon: Inbox, view: LeadsView },
  { id: "pipeline", label: "Pipeline", icon: Briefcase, view: PipelineView },
  { id: "clients", label: "Clients", icon: Users, view: ClientsView },
  { id: "projects", label: "Projects", icon: FolderKanban, view: ProjectsView },
  { id: "invoices", label: "Invoices & quotes", icon: FileText, view: InvoicesView },
  { id: "subscribers", label: "Subscribers", icon: Mail, view: SubscribersView },
  { id: "site", label: "Site", icon: Globe, view: SiteView },
  { id: "settings", label: "Settings", icon: SettingsIcon, view: SettingsView },
] as const;

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(password);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass-card w-full max-w-md p-8">
        <p className="label mb-4">Private access</p>
        <h1 className="mb-2 text-3xl t-primary">Cubic OS</h1>
        <p className="mb-6 text-sm t-muted">Leads, pipeline, clients, projects and billing for CubicTech.</p>
        <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium t-secondary">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="glow-input mb-3"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "admin-login-error" : undefined}
          autoFocus
        />
        {error && <p id="admin-login-error" role="alert" className="mb-3 text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="btn-primary h-12 w-full rounded-xl disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

export default function Admin() {
  useNoIndex();
  const signedIn = useAdminSession();
  const params = useParams<{ tab?: string }>();
  const queryClient = useQueryClient();
  const active = tabs.find((tab) => tab.id === params.tab) ?? tabs[0];

  if (signedIn === null) return <p className="p-10 text-center t-muted">Loading…</p>;
  if (!signedIn) {
    return (
      <>
        <PageMeta title="Cubic OS" description="CubicTech internal workspace" />
        <Login />
      </>
    );
  }

  async function handleSignOut() {
    await signOut();
    queryClient.removeQueries({ queryKey: ["os"] });
  }

  const View = active.view;
  return (
    <>
      <PageMeta title={`${active.label} · Cubic OS`} description="CubicTech internal workspace" />
      <div className="min-h-screen lg:grid lg:grid-cols-[232px_1fr]">
        <aside className="border-b border-white/10 bg-black/40 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-5">
            <Link href="/" className="text-lg font-semibold t-primary">Cubic<span className="text-[var(--accent-primary)]">OS</span></Link>
            <button onClick={handleSignOut} className="t-muted hover:t-primary lg:hidden" aria-label="Sign out"><LogOut className="h-4 w-4" /></button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === active.id;
              return (
                <Link
                  key={tab.id}
                  href={`/admin/${tab.id}`}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-white/10 t-primary" : "t-muted hover:bg-white/5"}`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={handleSignOut} className="absolute bottom-6 left-5 hidden items-center gap-2 text-sm t-muted hover:t-primary lg:flex">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>
        <main className="min-w-0 px-4 py-8 md:px-8 lg:px-10">
          <View />
        </main>
      </div>
    </>
  );
}
