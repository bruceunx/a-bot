import type { Cookie } from "electron";
import type { AccountRow } from "../main/types";

// Share UI type to backend
export type UIParseAccount = {
  username: string;
  avatar: string;
  accountId: string;
};

// Share backend type to UI
export type Group = {
  id: number;
  name: string;
};

export type AccountWithGroups = Omit<AccountRow, "cookies" | "groups_json"> & {
  cookies: Cookie[];
  groups: Group[];
};

export enum JobStatus {
  Running = 0,
  Completed = 1,
  Failed = 2,
}

export enum TaskStatus {
  Failed = 0,
  Success = 1,
}

export interface PublishJob {
  id: number;
  status: JobStatus; // 0, 1, or 2
  total_tasks: number;
  created_at: string;
  finished_at?: string;
  tasks?: PublishTask[];
}

export interface PublishTask {
  id: number;
  job_id: number;
  account_id: number;
  account_username: string;
  status: TaskStatus; // 0 or 1
  log?: string;
  created_at: string;
}
