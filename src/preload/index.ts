import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { UIParseAccount } from "@common/types";

// Custom APIs for renderer
const api = {
  getCookies: (webContentsId: number) =>
    ipcRenderer.invoke("get-cookies", webContentsId),

  saveAccount: (
    webContentsId: number,
    account: UIParseAccount,
    platform: string,
  ) => ipcRenderer.invoke("save-account", webContentsId, account, platform),
  getAccounts: () => ipcRenderer.invoke("get-accounts"),
  getGroups: () => ipcRenderer.invoke("get-groups"),
  loadCookies: (webContentsId: number) =>
    ipcRenderer.invoke("load-cookies", webContentsId),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
