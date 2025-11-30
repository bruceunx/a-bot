import type { Browser, Page } from "playwright";
import { chromium } from "playwright";

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
        headless: false,
        executablePath: defaultChromePath,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
      });

      this.page = await this.browser.newPage();
      await this.page.setViewportSize({ width: 1280, height: 800 });

      console.log("Successfully launched Chrome from:", defaultChromePath);
    } catch (error) {
      console.error("Failed to launch Chrome from path:", defaultChromePath);
      console.error("Falling back to bundled Chromium", error);
      this.browser = await chromium.launch({
        headless: true
      });
    }
  }
}
