import type { ElectronAPI } from "@electron-toolkit/preload";
import type { Cookie } from "../types/ipc";

interface WebContentsAPI {
  getCookies: (webContentsId: number) => Promise<{
    cookies: Cookie[];
  } | null>;
  setCookie: (
    webContentsId: number,
    cookieDetails: Cookie[]
  ) => Promise<{ success: boolean; error?: string }>;

  saveCookies: (webContentsId: number) => Promise<number | null>;
  loadCookies: (webContentsId: number) => Promise<number | null>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WebContentsAPI;
  }
}
