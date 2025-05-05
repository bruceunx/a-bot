import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { Cookie } from "../types/ipc";

// Custom APIs for renderer
const api = {
  getCookies: (webContentsId: number) => ipcRenderer.invoke("get-cookies", webContentsId),
  setCookie: (webContentsId: number, cookieDetails: Cookie[]) =>
    ipcRenderer.invoke("set-cookie", webContentsId, cookieDetails)
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
