import fs from "fs";
import path from "path";
import { pool } from "../db";
import type { Activity, Client, Deal, Invoice, Lead, Project, Settings } from "@shared/os";

/**
 * One JSON document holds the whole firm. Small enough for a one-person studio for years,
 * and it means the same code persists to a local file or to a single Postgres row.
 */
export type OsDocument = {
  leads: Lead[];
  deals: Deal[];
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  activity: Activity[];
  settings: Settings;
  seq: Record<string, number>;
};

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

const emptyDocument = (): OsDocument => ({
  leads: [],
  deals: [],
  clients: [],
  projects: [],
  invoices: [],
  activity: [],
  settings: defaultSettings,
  seq: {},
});

interface Backend {
  load(): Promise<OsDocument | null>;
  save(doc: OsDocument): Promise<void>;
}

class FileBackend implements Backend {
  constructor(private readonly file: string) {}

  async load() {
    if (!fs.existsSync(this.file)) return null;
    return JSON.parse(await fs.promises.readFile(this.file, "utf8")) as OsDocument;
  }

  async save(doc: OsDocument) {
    await fs.promises.mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.tmp`;
    await fs.promises.writeFile(tmp, JSON.stringify(doc, null, 2), "utf8");
    await fs.promises.rename(tmp, this.file);
  }
}

class PostgresBackend implements Backend {
  private ready: Promise<unknown> | null = null;

  private init() {
    this.ready ??= pool!
      .query("CREATE TABLE IF NOT EXISTS cubic_os_documents (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())")
      .catch((error) => {
        this.ready = null;
        throw error;
      });
    return this.ready;
  }

  async load() {
    await this.init();
    const result = await pool!.query("SELECT value FROM cubic_os_documents WHERE key = 'main'");
    return (result.rows[0]?.value as OsDocument | undefined) ?? null;
  }

  async save(doc: OsDocument) {
    await this.init();
    await pool!.query(
      "INSERT INTO cubic_os_documents (key, value, updated_at) VALUES ('main', $1, now()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()",
      [JSON.stringify(doc)],
    );
  }
}

const dataFile = process.env.CUBIC_DATA_FILE ?? path.join(process.cwd(), "data", "cubic-os.json");
const backend: Backend = pool ? new PostgresBackend() : new FileBackend(dataFile);

let cache: OsDocument | null = null;
let loading: Promise<OsDocument> | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function loadOnce(): Promise<OsDocument> {
  const loaded = await backend.load();
  const base = emptyDocument();
  return loaded ? { ...base, ...loaded, settings: { ...defaultSettings, ...loaded.settings } } : base;
}

/** The first load is shared, so a read racing the first write can never resurrect stale data. */
async function current(): Promise<OsDocument> {
  if (cache) return cache;
  loading ??= loadOnce().catch((error) => {
    loading = null;
    throw error;
  });
  const loaded = await loading;
  cache ??= loaded;
  return cache;
}

export async function read(): Promise<OsDocument> {
  await queue;
  return current();
}

/** Serialises writes so two requests can never interleave a read-modify-write. */
export function write<T>(mutate: (doc: OsDocument) => { doc: OsDocument; result: T }): Promise<T> {
  const run = queue.then(async () => {
    const { doc, result } = mutate(await current());
    await backend.save(doc);
    cache = doc;
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export function nextId(doc: OsDocument, key: string): { doc: OsDocument; id: number } {
  const fromRows = Math.max(0, ...((doc as unknown as Record<string, Array<{ id: number }>>)[key] ?? []).map((row) => row.id));
  const id = Math.max(doc.seq[key] ?? 0, fromRows) + 1;
  return { doc: { ...doc, seq: { ...doc.seq, [key]: id } }, id };
}

export function withActivity(doc: OsDocument, kind: string, text: string): OsDocument {
  const { doc: next, id } = nextId(doc, "activity");
  const entry: Activity = { id, at: new Date().toISOString(), kind, text };
  return { ...next, activity: [entry, ...next.activity].slice(0, 500) };
}
