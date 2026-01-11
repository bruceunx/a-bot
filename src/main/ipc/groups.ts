import { ipcMain } from "electron";
import { createGroup, deleteGroup, getGroups } from "../db";

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

  ipcMain.handle("create-group", async (_, name: string) => {
    try {
      const result = createGroup(name);
      return result.lastInsertRowid;
    } catch (error) {
      console.error("Failed to get groups with error: ", error);
      return null;
    }
  });

  ipcMain.handle("delete-group", async (_, id: number) => {
    try {
      const result = deleteGroup(id);
      return result.changes;
    } catch (error) {
      console.error("Failed to get groups with error: ", error);
      return null;
    }
  });
}
