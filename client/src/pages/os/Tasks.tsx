import { useMemo, useState, type FormEvent } from "react";
import { TASK_PRIORITIES, type Task } from "@shared/crm";
import { formatDate, osFetch, useOsMutation } from "@/lib/os-api";
import { isAdminRole, nameOf, useMe, useTasks, useTeam } from "@/lib/workspace-api";
import { AssigneeSelect } from "./parts";
import { Badge, Empty, Field, FormError, inputClass, Panel, primaryButton, Stat } from "./ui";

const today = () => new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
const priorityTone = { High: "bad", Normal: "default", Low: "info" } as const;

function QuickAdd() {
  const me = useMe();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(today());
  const [priority, setPriority] = useState<(typeof TASK_PRIORITIES)[number]>("Normal");
  const [assignedTo, setAssignedTo] = useState<number | null>(me.id);
  const add = useOsMutation(() => osFetch("POST", "/api/os/tasks", { title, dueDate, priority, assignedTo }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    add.mutate(undefined, { onSuccess: () => setTitle("") });
  };
  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
      <Field label="New task"><input required minLength={2} value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} min-w-[260px]`} placeholder="Send proposal to Acme" /></Field>
      <Field label="Due"><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} /></Field>
      <Field label="Priority">
        <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)} className={inputClass}>{TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
      </Field>
      <Field label="For"><AssigneeSelect value={assignedTo} onChange={setAssignedTo} /></Field>
      <button disabled={add.isPending} className={primaryButton}>Add</button>
      <FormError error={add.error} />
    </form>
  );
}

function TaskRow({ task }: { task: Task }) {
  const { data: team } = useTeam();
  const toggle = useOsMutation(() => osFetch("PATCH", `/api/os/tasks/${task.id}`, { done: !task.done }));
  const remove = useOsMutation(() => osFetch("DELETE", `/api/os/tasks/${task.id}`));
  const overdue = !task.done && task.dueDate !== "" && task.dueDate < today();
  return (
    <li className="flex items-start gap-3 py-3">
      <input type="checkbox" checked={task.done} onChange={() => toggle.mutate(undefined)} className="mt-1 h-4 w-4 accent-[var(--accent-primary)]" aria-label={`Mark "${task.title}" ${task.done ? "not done" : "done"}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${task.done ? "line-through t-muted" : "t-primary"}`}>{task.title}</p>
        <p className="mt-0.5 text-xs t-muted">
          {task.entityLabel && `${task.entityLabel} · `}{nameOf(team, task.assignedTo)}
          {task.done && task.completedAt && ` · done ${formatDate(task.completedAt)}`}
        </p>
      </div>
      {task.priority !== "Normal" && <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>}
      {task.dueDate && <Badge tone={overdue ? "bad" : task.dueDate === today() ? "warn" : "default"}>{formatDate(task.dueDate)}</Badge>}
      <button onClick={() => confirm("Delete this task?") && remove.mutate(undefined)} className="text-xs text-red-300/70 hover:text-red-300" aria-label={`Delete "${task.title}"`}>✕</button>
    </li>
  );
}

export default function TasksView() {
  const me = useMe();
  const { data: tasks = [], isLoading } = useTasks();
  const [scope, setScope] = useState(isAdminRole(me.role) ? "mine" : "mine");
  const shown = useMemo(() => tasks.filter((task) => scope === "all" || task.assignedTo === me.id), [tasks, scope, me.id]);
  const open = shown.filter((task) => !task.done);
  const overdue = open.filter((task) => task.dueDate && task.dueDate < today());
  const dueToday = open.filter((task) => task.dueDate === today());
  const later = open.filter((task) => !task.dueDate || task.dueDate > today());
  const done = shown.filter((task) => task.done).slice(0, 20);

  const section = (title: string, rows: Task[], empty: string) => (
    <Panel title={`${title} (${rows.length})`}>
      {rows.length === 0 ? <Empty>{empty}</Empty> : <ul className="divide-y divide-white/5">{rows.map((task) => <TaskRow key={task.id} task={task} />)}</ul>}
    </Panel>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Follow-ups and to-dos</p>
          <h1 className="text-3xl t-primary">Tasks</h1>
        </div>
        <select aria-label="Whose tasks" value={scope} onChange={(e) => setScope(e.target.value)} className={`${inputClass} !w-auto`}>
          <option value="mine">My tasks</option>
          <option value="all">{isAdminRole(me.role) ? "Everyone's" : "Mine + unassigned"}</option>
        </select>
      </header>
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Overdue" value={overdue.length} tone={overdue.length ? "warn" : "default"} />
        <Stat label="Due today" value={dueToday.length} />
        <Stat label="Open" value={open.length} />
      </div>
      <Panel><QuickAdd /></Panel>
      {isLoading ? (
        <p className="t-muted">Loading…</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {section("Overdue", overdue, "Nothing overdue.")}
          {section("Today", dueToday, "Nothing due today.")}
          {section("Upcoming", later, "No upcoming tasks.")}
          {section("Recently done", done, "Finished tasks show here.")}
        </div>
      )}
    </div>
  );
}
