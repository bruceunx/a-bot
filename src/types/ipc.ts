import type { Cookie } from "electron";

export type Account = {
  id?: number;
  accountId: string;
  username: string;
  avatar: string;
  cookies: Cookie[];
  platform: string;
};

export type RawAccount = {
  username: string;
  avatar: string;
  accountId: string;
};
