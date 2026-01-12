import type { UIParseAccount } from "@common/types";

import { ipcMain, webContents } from "electron";
import { addAccount, getAccounts } from "../db";

export function registerAccountsHandles() {
  ipcMain.handle(
    "save-account",
    async (
      _,
      webContentsId: number,
      account: UIParseAccount,
      platform: string,
    ) => {
      const wc = webContents.fromId(webContentsId);
      if (!wc) return;
      const cookies = await wc.session.cookies.get({});

      try {
        addAccount({
          ...account,
          cookies: cookies,
          platform: platform,
        });
        console.log(
          `[DB] Saved ${account.username} (${platform}) with ${cookies.length} cookies.`,
        );
        return { success: true, cookieCount: cookies.length };
      } catch (_) {
        return { success: false, cookieCount: 0 };
      }
    },
  );

  ipcMain.handle("get-accounts", async (_) => {
    try {
      const accounts = getAccounts();
      return accounts;
    } catch (error) {
      console.error("Failed to get accounts", error);
      return null;
    }
  });
}
