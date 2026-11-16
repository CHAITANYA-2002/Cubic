// First-touch campaign attribution for this browser session: utm_* parameters and the referring
// site, kept in sessionStorage (cleared when the tab closes) and sent with enquiries only.
const KEY = "cubic-attribution";
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const parts = UTM.filter((key) => params.get(key)).map((key) => `${key.slice(4)}=${params.get(key)?.slice(0, 60)}`);
    const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? new URL(document.referrer).host : "";
    if (referrer) parts.push(`ref=${referrer}`);
    sessionStorage.setItem(KEY, parts.join("; ").slice(0, 300));
  } catch {
    // Storage blocked: attribution is optional.
  }
}

export function readAttribution(): { page: string; utm: string } {
  if (typeof window === "undefined") return { page: "", utm: "" };
  let utm = "";
  try {
    utm = sessionStorage.getItem(KEY) ?? "";
  } catch {
    utm = "";
  }
  return { page: window.location.pathname.slice(0, 200), utm };
}
