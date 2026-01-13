import type { Cookie } from "electron";

export type AccountRow = {
  id: number;
  accountId: string;
  username: string;
  avatar: string;
  platform: string;
  cookies: string;
  userAgent: string;
  status: number;
  groups_json?: string;
  created_at: string;
};

export type Account = {
  id?: number;
  accountId: string;
  username: string;
  avatar: string;
  cookies: Cookie[];
  platform: string;
};
