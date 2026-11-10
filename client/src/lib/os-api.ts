import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Client, Dashboard, Deal, Invoice, Lead, Project, Settings } from "@shared/os";

const TOKEN_KEY = "cubic-admin-token";

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setToken(token: string) {
  try {
    token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage blocked (private mode) — session lasts for this tab only.
  }
  window.dispatchEvent(new Event("cubic-auth"));
}

export async function osFetch<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": getToken() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401) {
    setToken("");
    throw new ApiError(401, "Session expired. Sign in again.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data.message ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export type OsState = { deals: Deal[]; clients: Client[]; projects: Project[]; invoices: Invoice[]; settings: Settings };

export const useOsState = () => useQuery({ queryKey: ["os", "state"], queryFn: () => osFetch<OsState>("GET", "/api/os/state") });
export const useDashboard = () => useQuery({ queryKey: ["os", "dashboard"], queryFn: () => osFetch<Dashboard>("GET", "/api/os/dashboard") });
export const useLeads = () => useQuery({ queryKey: ["os", "leads"], queryFn: () => osFetch<Lead[]>("GET", "/api/admin/submissions") });

/** Every write refreshes the whole OS cache — the data set is small and it keeps every view consistent. */
export function useOsMutation<TArgs, TResult = unknown>(run: (args: TArgs) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: run, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["os"] }) });
}

export const formatInr = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(value) ? 0 : 2 })}`;

export const formatDate = (iso: string) =>
  iso ? new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const newLocalId = () => Math.random().toString(36).slice(2, 10);
