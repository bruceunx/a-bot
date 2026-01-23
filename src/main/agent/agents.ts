import { ipcMain } from "electron/main";
import { createBrowser } from "./utils";

export function registerAgentHandles() {
  ipcMain.handle("xhs-publish", async (_) => {
    const { browser, page } = await createBrowser();
    await page.goto("https://baidu.com");
    await browser.close();
  });
}
