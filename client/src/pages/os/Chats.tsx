import { useMemo, useState } from "react";
import { Link } from "wouter";
import type { ChatRecord } from "@shared/crm";
import { osFetch, useOsMutation } from "@/lib/os-api";
import { isAdminRole, istDateTime, useChats, useMe } from "@/lib/workspace-api";
import { Badge, Empty, FormError, ghostButton, inputClass, Panel, Stat } from "./ui";

function Transcript({ chat }: { chat: ChatRecord }) {
  const me = useMe();
  const mark = useOsMutation((status: ChatRecord["status"]) => osFetch("PATCH", `/api/os/chats/${chat.id}`, { status }));
  const remove = useOsMutation(() => osFetch("DELETE", `/api/os/chats/${chat.id}`));
  return (
    <Panel
      title={`${istDateTime(chat.createdAt)} · ${chat.locale.toUpperCase()}${chat.page ? ` · ${chat.page}` : ""}`}
      action={
        <div className="flex gap-2">
          {chat.leadId && <Link href="/admin/leads" className="text-xs text-emerald-300">Lead #{chat.leadId} →</Link>}
          <button onClick={() => mark.mutate(chat.status === "Open" ? "Reviewed" : "Open")} className="text-xs t-muted hover:t-primary">{chat.status === "Open" ? "Mark reviewed" : "Reopen"}</button>
          {isAdminRole(me.role) && <button onClick={() => confirm("Delete this conversation?") && remove.mutate(undefined)} className="text-xs text-red-300/70">Delete</button>}
        </div>
      }
    >
      <ol className="space-y-3">
        {chat.messages.map((message, index) => (
          <li key={index} className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${message.role === "user" ? "ml-auto bg-white/10 t-primary" : "bg-white/[0.03] t-secondary"}`}>
            <p className="whitespace-pre-line">{message.content}</p>
          </li>
        ))}
      </ol>
      <FormError error={mark.error || remove.error} />
    </Panel>
  );
}

export default function ChatsView() {
  const { data: chats = [], isLoading } = useChats();
  const [filter, setFilter] = useState("Open");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const shown = useMemo(
    () =>
      chats.filter(
        (chat) =>
          (filter === "All" || (filter === "With lead" ? chat.leadId !== null : chat.status === filter)) &&
          chat.messages.some((message) => message.content.toLowerCase().includes(search.toLowerCase())),
      ),
    [chats, filter, search],
  );
  const open = chats.find((chat) => chat.id === openId) ?? shown[0] ?? null;

  return (
    <div className="space-y-6">
      <header>
        <p className="label mb-2">Website assistant conversations</p>
        <h1 className="text-3xl t-primary">Chats</h1>
      </header>
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Today" value={chats.filter((chat) => chat.createdAt.startsWith(today)).length} />
        <Stat label="To review" value={chats.filter((chat) => chat.status === "Open").length} />
        <Stat label="Became leads" value={chats.filter((chat) => chat.leadId !== null).length} tone="good" />
      </div>
      <div className="flex flex-wrap gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputClass} max-w-xs`} placeholder="Search what visitors asked" aria-label="Search chats" />
        <select aria-label="Filter" value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputClass} !w-auto`}>
          {["Open", "Reviewed", "With lead", "All"].map((value) => <option key={value}>{value}</option>)}
        </select>
        <Link href="/admin/chatbot" className={ghostButton}>Teach the bot →</Link>
      </div>
      {isLoading ? (
        <p className="t-muted">Loading…</p>
      ) : shown.length === 0 ? (
        <Panel><Empty>No conversations here yet.</Empty></Panel>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ul className="space-y-2">
            {shown.map((chat) => {
              const first = chat.messages.find((message) => message.role === "user")?.content ?? "";
              return (
                <li key={chat.id}>
                  <button onClick={() => setOpenId(chat.id)} className={`w-full rounded-xl border p-3 text-left ${open?.id === chat.id ? "border-white/30 bg-white/[0.06]" : "border-white/10 bg-white/[0.02]"}`}>
                    <p className="truncate text-sm t-primary">{first || "(empty)"}</p>
                    <p className="mt-1 flex items-center gap-2 text-[11px] t-muted">
                      {istDateTime(chat.updatedAt)} · {chat.messageCount / 2} questions
                      {chat.leadId && <Badge tone="good">Lead</Badge>}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
          {open && <Transcript chat={open} />}
        </div>
      )}
    </div>
  );
}
