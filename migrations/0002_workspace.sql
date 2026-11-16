-- Workspace v2: team logins and roles, lead ownership and sources, timeline, tasks, call booking,
-- the site chatbot and its knowledge base, expenses, and small JSON settings documents.

-- Staff accounts. The owner row is created on the first ADMIN_PASSWORD sign-in and has no hash.
-- token_version is part of every session cookie: bumping it signs that person out everywhere.
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'sales', 'delivery')),
  password_hash TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  takes_calls INTEGER NOT NULL DEFAULT 0,
  takes_leads INTEGER NOT NULL DEFAULT 0,
  availability TEXT NOT NULL DEFAULT '{}',
  token_version INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX users_email ON users(email) WHERE email <> '';
-- Exactly one owner: the person who holds ADMIN_PASSWORD.
CREATE UNIQUE INDEX users_one_owner ON users(role) WHERE role = 'owner';

-- Where a lead came from and who owns it.
ALTER TABLE leads ADD COLUMN source TEXT NOT NULL DEFAULT 'Website form';
ALTER TABLE leads ADD COLUMN assigned_to INTEGER;
ALTER TABLE leads ADD COLUMN page TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN utm TEXT NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';
CREATE INDEX leads_assigned ON leads(assigned_to);
CREATE INDEX leads_email ON leads(email);

ALTER TABLE deals ADD COLUMN assigned_to INTEGER;
CREATE INDEX deals_assigned ON deals(assigned_to);

-- One running history per record: notes, calls, emails, WhatsApp messages, meetings and system events.
CREATE TABLE timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity TEXT NOT NULL CHECK (entity IN ('lead', 'deal', 'client', 'project')),
  entity_id INTEGER NOT NULL,
  kind TEXT NOT NULL,
  text TEXT NOT NULL,
  user_id INTEGER,
  user_name TEXT NOT NULL DEFAULT '',
  at TEXT NOT NULL
);
CREATE INDEX timeline_entity ON timeline(entity, entity_id);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  due_date TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High')),
  done INTEGER NOT NULL DEFAULT 0,
  entity TEXT NOT NULL DEFAULT '',
  entity_id INTEGER,
  entity_label TEXT NOT NULL DEFAULT '',
  assigned_to INTEGER,
  created_by INTEGER,
  notes TEXT NOT NULL DEFAULT '',
  completed_at TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX tasks_assigned ON tasks(assigned_to, done);

-- Calls booked from /book or added by the team. Times are UTC ISO-8601; the UI shows IST.
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  host_id INTEGER NOT NULL,
  lead_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  topic TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT 'Google Meet',
  meeting_link TEXT NOT NULL DEFAULT '',
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No-show')),
  outcome TEXT NOT NULL DEFAULT '',
  locale TEXT NOT NULL DEFAULT 'en',
  manage_token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX bookings_start ON bookings(start_at);
CREATE INDEX bookings_host ON bookings(host_id, start_at);
-- One host cannot hold two live calls at the same start time, even under concurrent requests.
CREATE UNIQUE INDEX bookings_slot ON bookings(host_id, start_at) WHERE status = 'Scheduled';

-- Site chatbot conversations. ip_hash is a salted hash, never the raw address.
CREATE TABLE chats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'en',
  page TEXT NOT NULL DEFAULT '',
  ip_hash TEXT NOT NULL DEFAULT '',
  messages TEXT NOT NULL DEFAULT '[]',
  message_count INTEGER NOT NULL DEFAULT 0,
  lead_id INTEGER,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Reviewed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX chats_updated ON chats(updated_at);

-- Extra answers the owner teaches the chatbot, on top of everything already on the website.
CREATE TABLE kb_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  vendor TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  amount_inr INTEGER NOT NULL,
  gst_inr INTEGER NOT NULL DEFAULT 0,
  project_id INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX expenses_date ON expenses(date);

-- Small named JSON settings documents: 'scheduling', 'chatbot', 'assignment'.
CREATE TABLE app_docs (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
