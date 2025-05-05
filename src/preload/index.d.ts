import type { ElectronAPI } from "@electron-toolkit/preload";

type Cookie = {
  url: string;
  name: string;
  value: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  expirationDate?: number;
  sameSite?: "unspecified" | "no_restriction" | "lax" | "strict";
};

interface WebContentsAPI {
  getCookies: (webContentsId: number) => Promise<{
    cookies: Cookie[];
  } | null>;
  setCookie: (
    webContentsId: number,
    cookieDetails: Cookie[]
  ) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WebContentsAPI;
  }
}
