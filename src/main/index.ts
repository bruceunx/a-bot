/**
 * @module APP
 * @description Implement the APP module
 * @author bruce hu
 * @version 0.1.0
 */

import { app, BrowserWindow } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { registerCookieHandles } from "./ipc/cookies";
import { createWindow } from "./window";
import { initDatabase } from "./db";
// import { Agent } from "./agent";
// import { initialize, enable } from "@electron/remote/main";

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.brucehu.abot");
  initDatabase();

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  registerCookieHandles();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
