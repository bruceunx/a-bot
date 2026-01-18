import { LOGIN_METADATA, type PlatformMetadata } from "@common/constants";
import { BrowserWindow, type Cookie } from "electron";
import { setCookiesToSession } from "../utils";

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
      backgroundThrottling: false,
    },
  });

  try {
    const ses = win.webContents.session;

    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    ses.setUserAgent(userAgent);

    await ses.clearStorageData({ storages: ["cookies"] });

    await setCookiesToSession(ses, cookies, rule.cookie_url);

    try {
      await win.loadURL(rule.creator_url, { userAgent });
    } catch (error) {
      console.warn(`Load URL finished with warning (continuing):`, error);
    }

    await sleep(4000);

    const authResult = await win.webContents.executeJavaScript(rule.script);
    console.log("check authResult", authResult);

    return authResult.accountId !== "";
  } catch (err) {
    console.error(`Health check failed for ${platform}:`, err);
    return false;
  } finally {
    win.destroy();
  }
}
