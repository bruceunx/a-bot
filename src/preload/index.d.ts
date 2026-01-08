import type { ElectronAPI } from "@electron-toolkit/preload";
import type { RawAccount, Cookie, Account } from "../types/ipc";

interface WebContentsAPI {
  getCookies: (webContentsId: number) => Promise<{
    cookies: Cookie[];
  } | null>;

  saveAccount: (
    webContentsId: number,
    account: RawAccount,
    platform: string,
  ) => Promise<number | null>;

  getAccounts: () => Promise<Account[] | null>;

  loadCookies: (webContentsId: number) => Promise<number | null>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WebContentsAPI;
  }
}
