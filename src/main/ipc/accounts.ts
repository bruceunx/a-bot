import type { UIParseAccount } from "@common/types";

import { ipcMain, webContents } from "electron";
import {
  addAccount,
  addAccountToGroup,
  getAccounts,
  removeAccountFromGroup,
  updateAccountStatus,
} from "../db";
import { checkAccountHealth } from "../server/checkState";

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

  ipcMain.handle(
    "add-account-to-group",
    async (_, accountId: number, groupId: number) => {
      try {
        const result = addAccountToGroup(accountId, groupId);
        return result.lastInsertRowid;
      } catch (error) {
        console.error("Failed to add account to group", error);
        return null;
      }
    },
  );

  ipcMain.handle(
    "remove-account-from-group",
    async (_, accountId: number, groupId: number) => {
      try {
        const result = removeAccountFromGroup(accountId, groupId);
        return result.changes;
      } catch (error) {
        console.error("Failed to add account to group", error);
        return null;
      }
    },
  );

  ipcMain.handle("check-account-health", async (_) => {
    const accounts = getAccounts();

    for (const account of accounts) {
      console.log(`Checking ${account.platform} account ${account.id}...`);
      const isActive = await checkAccountHealth(
        account.platform,
        account.cookies,
      );
      console.log(`Result: ${isActive ? "Active" : "Expired"}`);
      updateAccountStatus(account.id, isActive ? 1 : 0);
    }
  });
}
