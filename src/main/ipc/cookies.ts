import type { Cookie } from "electron";

import { ipcMain, webContents } from "electron";

function getUrlFromCookieDomain(cookie: Cookie): string {
  const domain = cookie.domain?.startsWith(".")
    ? cookie.domain.substring(1)
    : cookie.domain;

  const scheme = cookie.secure ? "https" : "http";
  return `${scheme}://${domain}${cookie.path}`;
}

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
    "load-cookies",
    async (_, webContentsId: number, cookies: Cookie[], cookieUrl?: string) => {
      const wc = webContents.fromId(webContentsId);
      if (!wc) return;

      for (const cookie of cookies) {
        try {
          const newCookie = {
            url: cookieUrl ?? getUrlFromCookieDomain(cookie),
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
    },
  );
}
