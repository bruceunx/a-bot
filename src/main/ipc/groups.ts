import { ipcMain } from "electron";
import { getGroups } from "../db";

export function registerGroupsHandles() {
  ipcMain.handle("get-groups", async (_) => {
    try {
      const groups = getGroups();
      return groups;
    } catch (error) {
      console.error("Failed to get groups with error: ", error);
      return null;
    }
  });
}
