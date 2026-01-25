import type { AccountWithGroups } from "@common/types";

import { LOGIN_METADATA, type Platform } from "@common/constants";
import { ipcMain } from "electron/main";
import { createBrowser } from "./utils";
import pLimit from "p-limit";

const MAX_CONCURRENCY = 3;

async function publishSingleAccount(
  account: AccountWithGroups,
): Promise<boolean> {
  console.log(account);
  const { page, browser } = await createBrowser(account.cookies);

  const platformInfo = LOGIN_METADATA[account.platform as Platform];

  await page.goto(platformInfo.creator_url);

  // Process the automation

  await browser.close();
  return true;
}

export function registerAgentHandles() {
  ipcMain.handle("publish", async (_, accounts: AccountWithGroups[]) => {
    const limit = pLimit(MAX_CONCURRENCY);
    const tasks = accounts.map((acc) => limit(() => publishSingleAccount(acc)));
    const result = await Promise.all(tasks);
    return result;
  });
}
