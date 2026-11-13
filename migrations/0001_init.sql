-- CubicTech on Cloudflare D1. Money is stored as whole rupees (INTEGER). Timestamps are ISO-8601 text.
-- Nested lists (milestones, updates, invoice line items) are JSON text; they are always read with their row.

-- Website enquiries (the Inbox)
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE TABLE subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TEXT NOT NULL
);

-- Single-row JSON documents: public site settings (contact, socials, rate card) and firm settings (invoicing).
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE os_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Fixed-window rate limits, keyed e.g. "login:<ip>" or "contact:<ip>". reset_at is epoch milliseconds.
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);

-- Invoice / quote number series per financial year, e.g. "invoice-26-27".
CREATE TABLE counters (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);

CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  gstin TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  portal_token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL,
  value_inr INTEGER NOT NULL DEFAULT 0,
  probability INTEGER NOT NULL DEFAULT 0,
  next_action TEXT NOT NULL DEFAULT '',
  next_action_date TEXT NOT NULL DEFAULT '',
  lost_reason TEXT NOT NULL DEFAULT '',
  client_id INTEGER REFERENCES clients(id),
  lead_id INTEGER,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX deals_client ON deals(client_id);
CREATE INDEX deals_lead ON deals(lead_id);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL REFERENCES clients(id),
  deal_id INTEGER,
  name TEXT NOT NULL,
  service TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL,
  start_date TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL DEFAULT '',
  budget_inr INTEGER NOT NULL DEFAULT 0,
  milestones TEXT NOT NULL DEFAULT '[]',
  updates TEXT NOT NULL DEFAULT '[]',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX projects_client ON projects(client_id);
-- A deal can be won once: a second "Mark won" fails here and the whole batch rolls back.
CREATE UNIQUE INDEX projects_deal ON projects(deal_id) WHERE deal_id IS NOT NULL;

CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL CHECK (kind IN ('invoice', 'quote')),
  client_id INTEGER NOT NULL REFERENCES clients(id),
  project_id INTEGER REFERENCES projects(id),
  number TEXT NOT NULL DEFAULT '',
  issue_date TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL DEFAULT '',
  items TEXT NOT NULL DEFAULT '[]',
  gst_mode TEXT NOT NULL DEFAULT 'none',
  gst_rate REAL NOT NULL DEFAULT 18,
  status TEXT NOT NULL DEFAULT 'Draft',
  paid_date TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX invoices_client ON invoices(client_id);
CREATE INDEX invoices_project ON invoices(project_id);
-- GST requires a consecutive, never-reused series.
CREATE UNIQUE INDEX invoices_number ON invoices(number) WHERE number <> '';

CREATE TABLE activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  kind TEXT NOT NULL,
  text TEXT NOT NULL
);
