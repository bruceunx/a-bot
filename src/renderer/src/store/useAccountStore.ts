import type { AccountWithGroups, Group } from "@common/types";

import { create } from "zustand";

import { IPC } from "@renderer/constants/ipc";

interface AccountState {
  accounts: AccountWithGroups[];
  groups: Group[];
  isLoading: boolean;
  error: string | null;

  // Actions
  refreshData: () => Promise<void>;
  setAccounts: (accounts: AccountWithGroups[]) => void; // Optional helper
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  groups: [],
  isLoading: false,
  error: null,

  setAccounts: (accounts) => set({ accounts }),

  refreshData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [_accounts, _groups] = await Promise.all([
        window.electron.ipcRenderer.invoke(IPC.GET_ACCOUNTS),
        window.electron.ipcRenderer.invoke(IPC.GET_GROUPS),
      ]);

      set({
        accounts: _accounts || [],
        groups: _groups || [],
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to load data", err);
      set({
        isLoading: false,
        error: "Failed to fetch accounts and groups",
      });
    }
  },
}));
