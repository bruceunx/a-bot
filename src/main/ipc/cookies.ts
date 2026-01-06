import type { Cookie } from "electron";
import { ipcMain, webContents, app } from "electron";
import path from "node:path";
import fs from "node:fs";

function getUrlFromCookieDomain(cookie: Cookie): string {
  const domain = cookie.domain?.startsWith(".")
    ? cookie.domain.substring(1)
    : cookie.domain;

  const scheme = cookie.secure ? "https" : "http";
  return `${scheme}://${domain}${cookie.path}`;
}

const cookiePath = path.join(app.getPath("userData"), "cookies.json");
const authCookiePath = path.join(app.getPath("userData"), "auth.json");
console.log("cookie storage path", cookiePath);

export function registerCookieHandles() {
  ipcMain.handle("get-cookies", async (_, webContentsId: number) => {
    try {
      const contents = webContents.fromId(webContentsId);
      if (!contents) {
        return null;
      }
      const cookies = await contents.session.cookies.get({});

      return {
        cookies,
      };
    } catch (error) {
      console.error("Error accessing webContents or session:", error);
      return null;
    }
  });

  ipcMain.handle(
    "set-cookie",
    async (_, webContentsId: number, cookieDetails) => {
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
    },
  );

  ipcMain.handle("save-cookies", async (_, webContentsId: number) => {
    const wc = webContents.fromId(webContentsId);
    if (!wc) return;
    const cookies = await wc.session.cookies.get({});

    fs.writeFileSync(cookiePath, JSON.stringify(cookies, null, 2));
    console.log("write to file", cookiePath, cookies);
    return cookies.length;
  });

  ipcMain.handle("load-cookies", async (_, webContentsId: number) => {
    const wc = webContents.fromId(webContentsId);
    if (!wc) return;
    if (!fs.existsSync(cookiePath)) return;

    const cookies: Cookie[] = JSON.parse(
      fs.readFileSync(authCookiePath, "utf8"),
    );
    for (const cookie of cookies) {
      try {
        const newCookie = {
          url: getUrlFromCookieDomain(cookie),
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          expirationDate: cookie.expirationDate, // Vital for persistent login
          sameSite: cookie.sameSite,
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
