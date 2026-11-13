import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Client, Dashboard, Deal, Invoice, Lead, Project, Settings } from "@shared/os";
import type { Subscriber } from "@shared/schema";
import type { SiteSettings } from "@shared/site";

// The admin session is an HttpOnly cookie set by /api/admin/login. Nothing secret is ever stored in
// JavaScript-readable storage; the UI only tracks whether the server accepted the cookie.
const AUTH_EVENT = "cubic-auth";

export class ApiError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

/** Tell every mounted admin view the session changed (signed in, signed out or expired). */
export function announceAuth(signedIn: boolean) {
  window.dispatchEvent(new CustomEvent<boolean>(AUTH_EVENT, { detail: signedIn }));
}

export async function osFetch<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401) {
    announceAuth(false);
    throw new ApiError(401, "Session expired. Sign in again.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data.message ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, data.field ? `${message} (${data.field})` : message);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/session", { credentials: "same-origin" });
    return res.ok;
  } catch {
    return false;
  }
}

/** null while the first check runs, then whether the admin cookie is valid. */
export function useAdminSession(): boolean | null {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    checkSession().then((ok) => active && setSignedIn(ok));
    const sync = (event: Event) => setSignedIn(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener(AUTH_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);
  return signedIn;
}

export async function signIn(password: string): Promise<void> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message ?? "Sign in failed");
  announceAuth(true);
}

export async function signOut(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" }).catch(() => undefined);
  announceAuth(false);
}

/** Download an authenticated endpoint as a file (cookie is sent automatically). */
export async function downloadFile(url: string, filename: string): Promise<void> {
  const res = await fetch(url, { credentials: "same-origin" });
  if (res.status === 401) announceAuth(false);
  if (!res.ok) throw new ApiError(res.status, "Download failed");
  saveBlob(await res.blob(), filename);
}

export function saveBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  Object.assign(document.createElement("a"), { href, download: filename }).click();
  URL.revokeObjectURL(href);
}

/** RFC 4180 CSV with spreadsheet-formula injection neutralised. */
export function toCsv(rows: ReadonlyArray<ReadonlyArray<unknown>>): string {
  const cell = (value: unknown) => {
    const text = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return rows.map((row) => row.map(cell).join(",")).join("\n");
}

export type OsState = { deals: Deal[]; clients: Client[]; projects: Project[]; invoices: Invoice[]; settings: Settings };

export const useOsState = () => useQuery({ queryKey: ["os", "state"], queryFn: () => osFetch<OsState>("GET", "/api/os/state") });
export const useDashboard = () => useQuery({ queryKey: ["os", "dashboard"], queryFn: () => osFetch<Dashboard>("GET", "/api/os/dashboard") });
export const useLeads = () => useQuery({ queryKey: ["os", "leads"], queryFn: () => osFetch<Lead[]>("GET", "/api/admin/submissions") });
export const useSubscribers = () => useQuery({ queryKey: ["os", "subscribers"], queryFn: () => osFetch<Subscriber[]>("GET", "/api/admin/subscribers") });
async function fetchSiteFresh(): Promise<SiteSettings> {
  const res = await fetch("/api/site", { cache: "no-store" });
  if (!res.ok) throw new ApiError(res.status, "Could not load site settings");
  return (await res.json()) as SiteSettings;
}

/** Admin copy of the public site settings; bypasses the 60 s browser cache. */
export const useSiteSettings = () => useQuery({ queryKey: ["os", "site"], queryFn: fetchSiteFresh, staleTime: 0 });

/** Every write refreshes the whole OS cache — the data set is small and it keeps every view consistent. */
export function useOsMutation<TArgs, TResult = unknown>(run: (args: TArgs) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: run,
    onSuccess: () => Promise.all([queryClient.invalidateQueries({ queryKey: ["os"] }), queryClient.invalidateQueries({ queryKey: ["site"] })]),
  });
}

export const formatInr = (value: number) =>
  `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(value) ? 0 : 2 })}`;

export const formatDate = (iso: string) =>
  iso ? new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const newLocalId = () => Math.random().toString(36).slice(2, 10);

/** Keeps internal screens out of search results (robots.txt alone does not stop indexing of linked URLs). */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}
