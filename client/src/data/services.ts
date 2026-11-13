import { BrainCircuit, Globe, Layout, Megaphone, Monitor, Wrench, type LucideIcon } from "lucide-react";
import type { OfferId } from "@shared/site";
import type { ServiceLine } from "./work";

// Non-text facts about each service. Copy lives in the i18n dictionaries (services.items[slug]).
export const SERVICE_SLUGS = [
  "web-development",
  "web-applications",
  "ai-solutions",
  "digital-marketing",
  "ui-ux-design",
  "maintenance",
] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** The rate-card line a service's "from" price comes from. */
export const SERVICE_OFFER: Record<ServiceSlug, OfferId> = {
  "web-development": "landing",
  "web-applications": "webapp",
  "ai-solutions": "ai",
  "digital-marketing": "marketing",
  "ui-ux-design": "uiux",
  maintenance: "care",
};

export const SERVICE_ICON: Record<ServiceSlug, LucideIcon> = {
  "web-development": Monitor,
  "web-applications": Globe,
  "ai-solutions": BrainCircuit,
  "digital-marketing": Megaphone,
  "ui-ux-design": Layout,
  maintenance: Wrench,
};

/** Which live work to show as proof on each service page. */
export const SERVICE_LINE: Record<ServiceSlug, ServiceLine | null> = {
  "web-development": "websites",
  "web-applications": "apps",
  "ai-solutions": "ai",
  "digital-marketing": "marketing",
  "ui-ux-design": null,
  maintenance: null,
};

export const isServiceSlug = (value: string): value is ServiceSlug => (SERVICE_SLUGS as readonly string[]).includes(value);
