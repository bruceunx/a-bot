import type { Cookie } from "electron";

import { ipcMain, webContents } from "electron";
import { setCookiesToSession } from "../utils";

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
    async (_, webContentsId: number, cookies: Cookie[], cookieUrl: string) => {
      const wc = webContents.fromId(webContentsId);
      if (!wc) return;

      await setCookiesToSession(wc.session, cookies, cookieUrl);

      return cookies.length;
    },
  );
}
