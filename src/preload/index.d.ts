import type { ElectronAPI } from "@electron-toolkit/preload";
import type { Account, Cookie } from "../types/ipc";

interface WebContentsAPI {
  getCookies: (webContentsId: number) => Promise<{
    cookies: Cookie[];
  } | null>;

  saveAccount: (
    webContentsId: number,
    account: Account,
    platform: string,
  ) => Promise<number | null>;
  loadCookies: (webContentsId: number) => Promise<number | null>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WebContentsAPI;
  }
}
