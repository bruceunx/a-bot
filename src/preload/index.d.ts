import type { Cookie } from "electron";
import type { AccountWithGroups, Group, UIParseAccount } from "@common/types";
import type { ElectronAPI } from "@electron-toolkit/preload";

interface WebContentsAPI {
  getCookies: (webContentsId: number) => Promise<{
    cookies: Cookie[];
  } | null>;

  saveAccount: (
    webContentsId: number,
    account: UIParseAccount,
    platform: string,
  ) => Promise<number | null>;

  getAccounts: () => Promise<AccountWithGroups[] | null>;

  getGroups: () => Promise<Group[] | null>;

  loadCookies: (webContentsId: number) => Promise<number | null>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WebContentsAPI;
  }
}
