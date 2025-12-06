import { shell, BrowserWindow } from "electron";
import { is } from "@electron-toolkit/utils";

import { join } from "node:path";

import icon from "../../resources/icon.png?asset";

export function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,

    minWidth: 800,
    minHeight: 600,

    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      webviewTag: true
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}
