import { LOGIN_METADATA, type PlatformMetadata } from "@common/constants";
import { BrowserWindow, type Cookie } from "electron";

function getUrlFromCookieDomain(cookie: Cookie): string {
  const domain = cookie.domain?.startsWith(".")
    ? cookie.domain.substring(1)
    : cookie.domain;

  const scheme = cookie.secure ? "https" : "http";
  return `${scheme}://${domain}${cookie.path}`;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
        await ses.cookies.set(newCookie);
      } catch (e) {
        console.warn("Failed to restore cookie", cookie, e);
      }
    }

    await win.loadURL(rule.url);
    console.log(rule.creator_url);
    await new Promise<void>((resolve) => {
      // If it's already done, resolve immediately
      if (!win.webContents.isLoading()) {
        return resolve();
      }
      // Otherwise wait for the event
      win.webContents.once("did-finish-load", () => resolve());
    });

    // 3. (Crucial for SPAs) Wait for hydration
    // Even after 'did-finish-load', sites like TikTok/XHS take 1-3 seconds
    // to execute their JS and populate the window object or DOM.
    await sleep(3000);

    const authResult = await win.webContents.executeJavaScript(rule.script);
    console.log("check authResult", authResult);

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
