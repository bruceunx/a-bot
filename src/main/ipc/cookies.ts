import { ipcMain, webContents } from "electron";

export function registerCookieHandles() {
  ipcMain.handle("get-cookies", async (_, webContentsId: number) => {
    try {
      const contents = webContents.fromId(webContentsId);
      if (!contents) {
        return null;
      }
      const cookies = await contents.session.cookies.get({});

      return {
        cookies
      };
    } catch (error) {
      console.error("Error accessing webContents or session:", error);
      return null;
    }
  });

  ipcMain.handle("set-cookie", async (_, webContentsId: number, cookieDetails) => {
    try {
      const contents = webContents.fromId(webContentsId);
      if (!contents) {
        return { success: false, error: "WebContents not found" };
      }
      for (const cookie of cookieDetails) {
        await contents.session.cookies.set(cookie);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: `Error setting cookie: ${error}` };
    }
  });
}
