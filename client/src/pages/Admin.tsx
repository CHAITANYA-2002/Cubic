import { useState, type FormEvent } from "react";
import { Link, useParams } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Bot,
  Briefcase,
  CalendarClock,
  CheckSquare,
  FileText,
  FolderKanban,
  Globe,
  Inbox,
  LogOut,
  Mail,
  MessagesSquare,
  Receipt,
  Settings as SettingsIcon,
  ShieldCheck,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ROLE_LABELS, type Area } from "@shared/team";
import { PageMeta } from "@/components/PageMeta";
import { signIn, signOut, useAdminSession, useNoIndex } from "@/lib/os-api";
import { MeContext } from "@/lib/workspace-api";
import DashboardView from "./os/Dashboard";
import LeadsView from "./os/Leads";
import PipelineView from "./os/Pipeline";
import ClientsView from "./os/Clients";
import ProjectsView from "./os/Projects";
import InvoicesView from "./os/Invoices";
import SettingsView from "./os/Settings";
import SiteView from "./os/site/SiteView";
import SubscribersView from "./os/Subscribers";
import TasksView from "./os/Tasks";
import CallsView from "./os/Calls";
import ChatsView from "./os/Chats";
import KnowledgeView from "./os/Knowledge";
import ExpensesView from "./os/Expenses";
import TeamView from "./os/Team";
import AccountView from "./os/Account";

type Tab = { id: string; label: string; icon: LucideIcon; view: () => JSX.Element; area: Area | null; group: string };

const tabs: Tab[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, view: DashboardView, area: "dashboard", group: "Today" },
  { id: "tasks", label: "Tasks", icon: CheckSquare, view: TasksView, area: "tasks", group: "Today" },
  { id: "leads", label: "Inbox", icon: Inbox, view: LeadsView, area: "leads", group: "Sales" },
  { id: "pipeline", label: "Pipeline", icon: Briefcase, view: PipelineView, area: "pipeline", group: "Sales" },
  { id: "calls", label: "Calls", icon: CalendarClock, view: CallsView, area: "calls", group: "Sales" },
  { id: "chats", label: "Chats", icon: MessagesSquare, view: ChatsView, area: "chats", group: "Sales" },
  { id: "clients", label: "Clients", icon: Users, view: ClientsView, area: "clients", group: "Delivery" },
  { id: "projects", label: "Projects", icon: FolderKanban, view: ProjectsView, area: "projects", group: "Delivery" },
  { id: "invoices", label: "Invoices & quotes", icon: FileText, view: InvoicesView, area: "invoices", group: "Money" },
  { id: "expenses", label: "Expenses", icon: Receipt, view: ExpensesView, area: "expenses", group: "Money" },
  { id: "chatbot", label: "Chatbot", icon: Bot, view: KnowledgeView, area: "knowledge", group: "Website" },
  { id: "site", label: "Site", icon: Globe, view: SiteView, area: "site", group: "Website" },
  { id: "subscribers", label: "Subscribers", icon: Mail, view: SubscribersView, area: "subscribers", group: "Website" },
  { id: "team", label: "Team", icon: ShieldCheck, view: TeamView, area: "team", group: "Admin" },
  { id: "settings", label: "Settings", icon: SettingsIcon, view: SettingsView, area: "settings", group: "Admin" },
  { id: "account", label: "My account", icon: UserCircle, view: AccountView, area: null, group: "Admin" },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
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
        <p className="mb-6 text-sm t-muted">Sales, delivery and billing for the CubicTech team.</p>
        <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium t-secondary">Work email <span className="t-muted">(owner: leave blank)</span></label>
        <input id="admin-email" name="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="glow-input mb-3" autoFocus />
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
        />
        {error && <p id="admin-login-error" role="alert" className="mb-3 text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="btn-primary h-12 w-full rounded-xl disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

export default function Admin() {
  useNoIndex();
  const me = useAdminSession();
  const params = useParams<{ tab?: string }>();
  const queryClient = useQueryClient();

  if (me === null) return <p className="p-10 text-center t-muted">Loading…</p>;
  if (!me) {
    return (
      <>
        <PageMeta title="Cubic OS" description="CubicTech internal workspace" />
        <Login />
      </>
    );
  }

  const allowed = tabs.filter((tab) => tab.area === null || me.areas.includes(tab.area));
  const active = allowed.find((tab) => tab.id === params.tab) ?? allowed[0];
  const groups = Array.from(new Set(allowed.map((tab) => tab.group)));

  async function handleSignOut() {
    await signOut();
    queryClient.removeQueries({ queryKey: ["os"] });
  }

  const View = active.view;
  return (
    <MeContext.Provider value={me}>
      <PageMeta title={`${active.label} · Cubic OS`} description="CubicTech internal workspace" />
      <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-white/10 bg-black/40 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-5">
            <Link href="/" className="text-lg font-semibold t-primary">Cubic<span className="text-[var(--accent-primary)]">OS</span></Link>
            <button onClick={handleSignOut} className="t-muted hover:t-primary lg:hidden" aria-label="Sign out"><LogOut className="h-4 w-4" /></button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-y-auto" aria-label="Workspace">
            {groups.map((group) => (
              <div key={group} className="flex gap-1 lg:mb-3 lg:flex-col">
                <p className="hidden px-3 pb-1 pt-2 text-[10px] uppercase tracking-[0.18em] t-muted lg:block">{group}</p>
                {allowed
                  .filter((tab) => tab.group === group)
                  .map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === active.id;
                    return (
                      <Link
                        key={tab.id}
                        href={`/admin/${tab.id}`}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${isActive ? "bg-white/10 t-primary" : "t-muted hover:bg-white/5"}`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </Link>
                    );
                  })}
              </div>
            ))}
          </nav>
          <div className="hidden border-t border-white/10 px-5 py-4 lg:block">
            <p className="truncate text-sm t-primary">{me.name}</p>
            <p className="text-xs t-muted">{ROLE_LABELS[me.role]}</p>
            <button onClick={handleSignOut} className="mt-3 flex items-center gap-2 text-sm t-muted hover:t-primary">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>
        <main className="min-w-0 px-4 py-8 md:px-8 lg:px-10">
          <View />
        </main>
      </div>
    </MeContext.Provider>
  );
}
