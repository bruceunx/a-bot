import { LOGIN_METADATA, type PlatformMetadata } from "@common/constants";
import { BrowserWindow, type Cookie } from "electron";

function getUrlFromCookieDomain(cookie: Cookie): string {
  const domain = cookie.domain?.startsWith(".")
    ? cookie.domain.substring(1)
    : cookie.domain;

  const scheme = cookie.secure ? "https" : "http";
  return `${scheme}://${domain}${cookie.path}`;
}

export async function checkAccountHealth(
  platform: string,
  cookies: Cookie[],
): Promise<boolean> {
  const rule: PlatformMetadata = LOGIN_METADATA[platform.toUpperCase()];
  if (!rule) {
    console.error(`No health check rules for platform: ${platform}`);
    return false;
  }

  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    skipTaskbar: true,
    webPreferences: {
      partition: "temp:health-check",
      sandbox: true,
      images: false,
    },
  });

  try {
    const ses = win.webContents.session;

    await ses.clearStorageData({ storages: ["cookies"] });

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
          expirationDate: cookie.expirationDate,
          sameSite: cookie.sameSite,
        };
        console.log("new Cookie", newCookie);
        await ses.cookies.set(newCookie);
      } catch (e) {
        console.warn("Failed to restore cookie", cookie, e);
      }
    }

    await win.loadURL(rule.url);

    const authResult = await win.webContents.executeJavaScript(rule.script);

    return authResult.accountId !== "";
  } catch (err) {
    console.error(`Health check failed for ${platform}:`, err);
    return false;
  } finally {
    // 6. Cleanup: Close the window to free RAM
    // Force close to prevent memory leaks
    win.destroy();
  }
}
