import type { Group } from "@common/types";
import type { AccountRow, Account } from "./types";

import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

let db: Database.Database | null = null;

export function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "inner.db");

  // db = new Database(dbPath, { verbose: console.log });
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      accountId TEXT NOT NULL UNIQUE,
      username TEXT,
      avatar TEXT,
      platform TEXT, -- e.g., 'facebook', 'twitter'
      cookies TEXT NOT NULL, -- Stored as JSON string
      status INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createGroupsTable = `
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `;

  const createAccountGroupsTable = `
    CREATE TABLE IF NOT EXISTS account_groups (
      account_id INTEGER NOT NULL,
      group_id INTEGER NOT NULL,
      PRIMARY KEY (account_id, group_id),
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    );
  `;

  db.transaction(() => {
    if (!db) return;
    db.exec(createTableQuery);
    db.exec(createGroupsTable);
    db.exec(createAccountGroupsTable);
  })();
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
  const query = `
    SELECT
      a.*,
      (
        SELECT json_group_array(
          json_object('id', g.id, 'name', g.name)
        )
        FROM account_groups ag
        JOIN groups g ON ag.group_id = g.id
        WHERE ag.account_id = a.id
      ) as groups_json
    FROM accounts a
    ORDER BY a.created_at DESC
  `;

  const stmt = db.prepare(query);
  const rows = stmt.all() as AccountRow[];
  return rows.map((row) => {
    const cookies = JSON.parse(row.cookies);

    const groups: Group[] = row.groups_json ? JSON.parse(row.groups_json) : [];

    // biome-ignore lint/correctness/noUnusedVariables: ignore logs
    const { groups_json, ...rest } = row;

    return {
      ...rest,
      cookies,
      groups,
    };
  });
}

export function updateAccountStatus(id: number, status: number) {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    UPDATE accounts
    SET status = @status
    WHERE id = @id
  `);

  return stmt.run({ id, status });
}

export function createGroup(name: string) {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`INSERT OR IGNORE INTO groups (name) VALUES (?)`);
  return stmt.run(name);
}

export function getGroups(): Group[] {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`SELECT * FROM groups ORDER BY name ASC`);
  return stmt.all() as Group[];
}

export function deleteGroup(id: number) {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`DELETE FROM groups WHERE id = ?`);
  return stmt.run(id);
}

export function addAccountToGroup(accountId: number, groupId: number) {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO account_groups (account_id, group_id)
    VALUES (@accountId, @groupId)
  `);

  return stmt.run({ accountId, groupId });
}

export function removeAccountFromGroup(accountId: number, groupId: number) {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    DELETE FROM account_groups
    WHERE account_id = @accountId AND group_id = @groupId
  `);

  return stmt.run({ accountId, groupId });
}
