import type { Account } from "../types/ipc";

import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

interface AccountRow {
  id: number;
  accountId: string;
  username: string;
  platform: string;
  cookies: string;
  userAgent: string;
  status: string;
  created_at: string;
}

let db: Database.Database | null = null;

export function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "inner.db");

  db = new Database(dbPath, { verbose: console.log });
  db.pragma("journal_mode = WAL");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      accountId TEXT NOT NULL UNIQUE,
      username TEXT,
      avatar TEXT,
      platform TEXT, -- e.g., 'facebook', 'twitter'
      cookies TEXT NOT NULL, -- Stored as JSON string
      status TEXT DEFAULT 'active', -- 'active', 'suspended', 'expired'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.exec(createTableQuery);
  console.log(`Database initialized at: ${dbPath}`);
}

export function addAccount(account: Account) {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    INSERT INTO accounts (accountId, username, avatar, cookies, platform)
    VALUES (@accountId, @username, @avatar, @cookies, @platform)
    ON CONFLICT(accountId) DO UPDATE SET
      cookies = @cookies,
      username = @username,
      avatar = @avatar,
      status = 'active'
  `);

  return stmt.run({ ...account, cookies: JSON.stringify(account.cookies) });
}

export function getAccounts() {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare("SELECT * FROM accounts");
  const rows = stmt.all() as AccountRow[];

  return rows.map((row) => ({
    ...row,
    cookies: JSON.parse(row.cookies),
  }));
}
