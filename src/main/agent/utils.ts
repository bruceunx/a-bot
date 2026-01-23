import type { Cookie as ElectronCookie } from "electron";
import type { Cookie as PlaywrightCookie } from "playwright";

import { chromium } from "playwright";

export function electronToPlaywrightCookies(
  electronCookies: ElectronCookie[],
): PlaywrightCookie[] {
  return electronCookies.map((ec) => ({
    name: ec.name,
    value: ec.value,
    domain: ec.domain ?? "",
    path: ec.path ?? "",
    expires: ec.expirationDate ? ec.expirationDate : -1,
    httpOnly: ec.httpOnly ?? true,
    secure: ec.secure ?? true,
    sameSite:
      ec.sameSite === "unspecified"
        ? "None"
        : ec.sameSite === "no_restriction"
          ? "None"
          : ec.sameSite === "lax"
            ? "Lax"
            : "Strict",
  }));
}

const CHROME_PATHS = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
  win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
};

const ChromePath = CHROME_PATHS[process.platform];

export async function createBrowser(cookies?: ElectronCookie[]) {
  const browser = await chromium.launch({
    headless: false,
    executablePath: ChromePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  if (cookies) {
    await context.addCookies(electronToPlaywrightCookies(cookies));
  }

  const page = await context.newPage();
  return { browser, page };
}
