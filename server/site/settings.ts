import { DEFAULT_SITE, OFFER_IDS, siteSettingsSchema, type SiteSettings } from "../../shared/site";
import type { D1Database } from "../db/d1";
import { HttpError } from "../http";

/**
 * Stored overrides sit on top of DEFAULT_SITE, so an offer or social added to the defaults later
 * shows up without an admin re-save. Anything that no longer validates falls back to the defaults.
 */
export function mergeSite(stored: unknown): SiteSettings {
  if (!stored || typeof stored !== "object") return DEFAULT_SITE;
  const partial = stored as Partial<SiteSettings>;
  const merged = {
    ...DEFAULT_SITE,
    ...partial,
    socials: { ...DEFAULT_SITE.socials, ...partial.socials },
    fx: { ...DEFAULT_SITE.fx, ...partial.fx },
    prices: { ...DEFAULT_SITE.prices, ...partial.prices },
  };
  const result = siteSettingsSchema.safeParse(merged);
  return result.success ? result.data : DEFAULT_SITE;
}

export async function loadSite(db: D1Database): Promise<SiteSettings> {
  const row = await db.prepare("SELECT data FROM site_settings WHERE id = 1").first<{ data: string }>();
  if (!row) return DEFAULT_SITE;
  try {
    return mergeSite(JSON.parse(row.data));
  } catch {
    return DEFAULT_SITE;
  }
}

/** Schema check plus the rules the schema cannot express: min ≤ max and every offer priced. */
export function validateSite(body: unknown): SiteSettings {
  const site = siteSettingsSchema.parse(body);
  OFFER_IDS.forEach((id) => {
    const price = site.prices[id];
    if (!price) throw new HttpError(400, `Add a price for "${id}".`);
    if (price.inr[0] > price.inr[1] || price.usd[0] > price.usd[1]) throw new HttpError(400, `"${id}": the minimum cannot be above the maximum.`);
  });
  return site;
}

export async function saveSite(db: D1Database, site: SiteSettings): Promise<void> {
  await db
    .prepare("INSERT INTO site_settings (id, data, updated_at) VALUES (1, ?1, ?2) ON CONFLICT(id) DO UPDATE SET data = ?1, updated_at = ?2")
    .bind(JSON.stringify(site), new Date().toISOString())
    .run();
}
