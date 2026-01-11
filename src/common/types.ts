import type { Cookie } from "electron";
import type { AccountRow } from "../main/types";

// Share UI type to backend
export type UIParseAccount = {
  username: string;
  avatar: string;
  accountId: string;
};

// Share backend type to UI
export type Group = {
  id: number;
  name: string;
};

export type AccountWithGroups = Omit<AccountRow, "cookies" | "groups_json"> & {
  cookies: Cookie[];
  groups: Group[];
};
