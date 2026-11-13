import { settingsInput, type Settings } from "../../shared/os";
import type { D1Database } from "../db/d1";

export const defaultSettings: Settings = {
  businessName: "CubicTech",
  legalName: "",
  gstin: "",
  pan: "",
  address: "",
  email: "chaitanyakhurana10@gmail.com",
  phone: "+91 79769 89699",
  website: "https://cubictech.in",
  bankName: "",
  accountName: "",
  accountNumber: "",
  ifsc: "",
  upiId: "",
  invoicePrefix: "CT",
  paymentTermsDays: 15,
  invoiceFooter: "Thank you for your business.",
};

export async function loadSettings(db: D1Database): Promise<Settings> {
  const row = await db.prepare("SELECT data FROM os_settings WHERE id = 1").first<{ data: string }>();
  if (!row) return defaultSettings;
  try {
    const parsed = settingsInput.safeParse({ ...defaultSettings, ...JSON.parse(row.data) });
    return parsed.success ? parsed.data : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(db: D1Database, settings: Settings): Promise<void> {
  await db
    .prepare("INSERT INTO os_settings (id, data, updated_at) VALUES (1, ?1, ?2) ON CONFLICT(id) DO UPDATE SET data = ?1, updated_at = ?2")
    .bind(JSON.stringify(settings), new Date().toISOString())
    .run();
}
