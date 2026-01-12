import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { UIParseAccount } from "@common/types";

// Custom APIs for renderer
const api = {
  // cookies
  getCookies: (webContentsId: number) =>
    ipcRenderer.invoke("get-cookies", webContentsId),
  loadCookies: (webContentsId: number) =>
    ipcRenderer.invoke("load-cookies", webContentsId),

  // accounts
  saveAccount: (
    webContentsId: number,
    account: UIParseAccount,
    platform: string,
  ) => ipcRenderer.invoke("save-account", webContentsId, account, platform),
  getAccounts: () => ipcRenderer.invoke("get-accounts"),

  addAccountToGroup: (accountId: number, groupId: number) =>
    ipcRenderer.invoke("add-account-to-group", accountId, groupId),
  removeAccountFromGroup: (accountId: number, groupId: number) =>
    ipcRenderer.invoke("remove-account-from-group", accountId, groupId),

  // groups
  getGroups: () => ipcRenderer.invoke("get-groups"),
  createGroup: (name: string) => ipcRenderer.invoke("create-group", name),
  deleteGroup: (id: number) => ipcRenderer.invoke("delete-group", id),
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
