import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Booking, ChatbotSettings, ChatRecord, Expense, KbEntry, Task, TimelineEntity, TimelineEntry } from "@shared/crm";
import type { Assignment, Me, Role, Scheduling, TeamUser } from "@shared/team";
import { osFetch } from "./os-api";

/** The signed-in person, provided by the admin shell to every view. */
export const MeContext = createContext<Me | null>(null);
export function useMe(): Me {
  const me = useContext(MeContext);
  if (!me) throw new Error("useMe outside the admin shell");
  return me;
}

/** Owners get full rows; everyone else gets id, name, role and flags. */
export type TeamMember = Pick<TeamUser, "id" | "name" | "role" | "takesCalls" | "takesLeads"> & Partial<TeamUser>;

export const useTeam = () => useQuery({ queryKey: ["os", "team"], queryFn: () => osFetch<TeamMember[]>("GET", "/api/os/team") });
export const useTasks = () => useQuery({ queryKey: ["os", "tasks"], queryFn: () => osFetch<Task[]>("GET", "/api/os/tasks") });
export const useTimeline = (entity: TimelineEntity, id: number | null) =>
  useQuery({ queryKey: ["os", "timeline", entity, id], queryFn: () => osFetch<TimelineEntry[]>("GET", `/api/os/timeline/${entity}/${id}`), enabled: id !== null });
export const useCalls = () => useQuery({ queryKey: ["os", "calls"], queryFn: () => osFetch<Booking[]>("GET", "/api/os/calls") });
export const useScheduling = () => useQuery({ queryKey: ["os", "scheduling"], queryFn: () => osFetch<Scheduling>("GET", "/api/os/scheduling") });
export const useChats = () => useQuery({ queryKey: ["os", "chats"], queryFn: () => osFetch<ChatRecord[]>("GET", "/api/os/chats") });
export const useKb = () => useQuery({ queryKey: ["os", "kb"], queryFn: () => osFetch<KbEntry[]>("GET", "/api/os/kb") });
export const useChatbot = () =>
  useQuery({ queryKey: ["os", "chatbot"], queryFn: () => osFetch<{ settings: ChatbotSettings; usedToday: number; aiConnected: boolean }>("GET", "/api/os/chatbot") });
export const useExpenses = () => useQuery({ queryKey: ["os", "expenses"], queryFn: () => osFetch<Expense[]>("GET", "/api/os/expenses") });
export const useAssignment = () => useQuery({ queryKey: ["os", "assignment"], queryFn: () => osFetch<Assignment>("GET", "/api/os/assignment") });

export const nameOf = (team: TeamMember[] | undefined, id: number | null | undefined, fallback = "Unassigned") =>
  (id && team?.find((member) => member.id === id)?.name) || fallback;

export const isAdminRole = (role: Role) => role === "owner" || role === "admin";

/** "Mon 17 Nov, 4:30 pm" in IST, the timezone the team works in. */
export const istDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

/** Local datetime-local input value (IST) <-> ISO UTC. */
export const istInputToIso = (value: string) => new Date(`${value}:00+05:30`).toISOString();
export const isoToIstInput = (iso: string) => new Date(Date.parse(iso) + 330 * 60_000).toISOString().slice(0, 16);
