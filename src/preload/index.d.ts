import type { Cookie } from "electron";
import type { AccountWithGroups, Group, UIParseAccount } from "@common/types";
import type { ElectronAPI } from "@electron-toolkit/preload";

interface WebContentsAPI {
  // cookies
  getCookies: (webContentsId: number) => Promise<{
    cookies: Cookie[];
  } | null>;
  loadCookies: (webContentsId: number) => Promise<number | null>;

  // accounts
  saveAccount: (
    webContentsId: number,
    account: UIParseAccount,
    platform: string,
  ) => Promise<number | null>;
  getAccounts: () => Promise<AccountWithGroups[] | null>;
  addAccountToGroup: (
    accountId: number,
    groupId: number,
  ) => Promise<number | null>;
  removeAccountFromGroup: (
    accountId: number,
    groupId: number,
  ) => Promise<number | null>;

  checkAllAccounts: () => Promise<void>;

  // groups
  getGroups: () => Promise<Group[] | null>;
  createGroup: (name: string) => Promise<number | null>;
  deleteGroup: (id: number) => Promise<number | null>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WebContentsAPI;
  }
}
