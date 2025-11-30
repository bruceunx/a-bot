import { ipcMain, webContents, app } from "electron";
import path from "node:path";
import fs from "node:fs";

function getUrlFromCookieDomain(cookie) {
  const domain = cookie.domain.replace(/^\./, "");
  return `https://${domain}`;
}

const cookiePath = path.join(app.getPath("userData"), "cookies.json");
console.log(cookiePath);

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

  ipcMain.handle("save-cookies", async (_, webContentsId) => {
    const wc = webContents.fromId(webContentsId);
    if (!wc) return;
    const cookies = await wc.session.cookies.get({});

    const filterCookies = cookies
      .filter((cookie) => cookie.domain?.includes(".bilibili.com"))
      .map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
        domain: ".bilibili.com",
        path: cookie.path
      }));

    fs.writeFileSync(cookiePath, JSON.stringify(filterCookies, null, 2));
    return cookies.length;
  });

  ipcMain.handle("load-cookies", async (_, webContentsId) => {
    const wc = webContents.fromId(webContentsId);
    if (!wc) return;
    if (!fs.existsSync(cookiePath)) return;

    const cookies = JSON.parse(fs.readFileSync(cookiePath, "utf8"));
    for (const cookie of cookies) {
      try {
        const newCookie = {
          ...cookie,
          url: getUrlFromCookieDomain(cookie)
        };
        console.log("new Cookie", newCookie);
        await wc.session.cookies.set(newCookie);
      } catch (e) {
        console.warn("Failed to restore cookie", cookie, e);
      }
    }
    return cookies.length;
  });
}
