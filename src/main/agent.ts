import type { Browser, Page } from "playwright";
import { chromium } from "playwright";
// import { app } from "electron";
// import { path } from "node:path";

export class Agent {
  private browser!: Browser;
  private page!: Page;

  async initialize() {
    const chromePaths = {
      darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      linux: "/usr/bin/google-chrome",
      win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    };

    const defaultChromePath = chromePaths[process.platform];

    try {
      this.browser = await chromium.launch({
        headless: false, // Set to false for debugging
        executablePath: defaultChromePath,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
      });

      this.page = await this.browser.newPage();
      await this.page.setViewportSize({ width: 1280, height: 800 });

      // Navigate to the start URL
      // test
      // await this.page.goto("https://ipinfo.io", {
      //   waitUntil: "domcontentloaded",
      //   timeout: 30000 // 30 seconds timeout
      // });

      console.log("Successfully launched Chrome from:", defaultChromePath);
    } catch (error) {
      console.error("Failed to launch Chrome from path:", defaultChromePath);
      console.error("Falling back to bundled Chromium");
      // Fallback to bundled Chromium if local Chrome fails
      this.browser = await chromium.launch({
        headless: true
      });
    }
  }
}
