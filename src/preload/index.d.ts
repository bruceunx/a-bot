import type { ElectronAPI } from "@electron-toolkit/preload";

interface WebContentsAPI {
  getWebContentsWithSession: (webContentsId: number) => Promise<{
    id: number;
    url: string;
    title: string;
    isLoading: boolean;
  } | null>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: WebContentsAPI;
  }
}
