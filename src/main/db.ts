import {
  JobStatus,
  type TaskStatus,
  type PublishJob,
  type PublishTask,
  type Group,
} from "@common/types";
import type { AccountRow, Account } from "./types";
import type { Cookie } from "electron";

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

  const createJobsTable = `
    CREATE TABLE IF NOT EXISTS publish_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status INTEGER DEFAULT 0, -- 0: Running, 1: Completed, 2: Failed
      message TEXT, -- JSON stringify message
      total_tasks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      finished_at DATETIME
    );
  `;

  const createJobTasksTable = `
    CREATE TABLE IF NOT EXISTS publish_job_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      account_id INTEGER,
      account_username TEXT,
      status INTEGER, -- 0: Failed, 1: Success
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES publish_jobs(id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
    );
  `;

  db.transaction(() => {
    if (!db) return;
    db.exec(createTableQuery);
    db.exec(createGroupsTable);
    db.exec(createAccountGroupsTable);
    db.exec(createJobsTable);
    db.exec(createJobTasksTable);
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
      avatar = @avatar
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

export function updateAccountCookies(id: number, cookies: Cookie[]) {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    UPDATE accounts
    SET cookies = @cookies, status = 1
    WHERE id = @id
  `);

  return stmt.run({ id, cookies: JSON.stringify(cookies) });
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

export function deleteAccount(id: number) {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`DELETE FROM accounts WHERE id = ?`);
  return stmt.run(id);
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

export function createJob(
  totalTasks: number,
  message?: string,
): number | bigint {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    INSERT INTO publish_jobs (total_tasks, message, status)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(totalTasks, message || null, JobStatus.Running);
  return result.lastInsertRowid;
}

export function addJobTask(
  jobId: number | bigint,
  accountId: number,
  username: string,
  status: TaskStatus, // Expects 0 or 1
): number | bigint {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    INSERT INTO publish_job_tasks (job_id, account_id, account_username, status)
    VALUES (@jobId, @accountId, @username, @status)
  `);

  const result = stmt.run({
    jobId,
    accountId,
    username,
    status,
  });
  return result.lastInsertRowid;
}

export function completeJob(
  jobId: number | bigint,
  status: JobStatus = JobStatus.Completed,
): number | bigint {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    UPDATE publish_jobs
    SET status = ?, finished_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  const result = stmt.run(status, jobId);
  return result.changes;
}

export function getJobHistory(): PublishJob[] {
  if (!db) throw new Error("Database not initialized");

  const stmt = db.prepare(`
    SELECT * FROM publish_jobs
    ORDER BY created_at DESC
    LIMIT 50
  `);

  return stmt.all() as PublishJob[];
}

export function getJobDetails(jobId: number): PublishJob | null {
  if (!db) throw new Error("Database not initialized");

  const jobStmt = db.prepare(`SELECT * FROM publish_jobs WHERE id = ?`);
  const job = jobStmt.get(jobId) as PublishJob | undefined;

  if (!job) return null;

  const taskStmt = db.prepare(`
    SELECT * FROM publish_job_tasks
    WHERE job_id = ?
    ORDER BY id ASC
  `);

  const tasks = taskStmt.all(jobId) as PublishTask[];

  return { ...job, tasks };
}
