import type { AccountWithGroups } from "@common/types";

import { useState, useMemo, useEffect } from "react";
import * as Icons from "../Icons";
import { ConnectAccountModal } from "./ConnectAccountModal";
import { GroupManagerModal } from "./GroupManagerModal"; // Import new component
import { AccountGroupEditor } from "./AccountGroupEditor"; // Import new component
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { IPC } from "@renderer/constants/ipc";
import { useAccountStore } from "@renderer/store/useAccountStore";

export default function Account() {
  const { accounts, groups, refreshData } = useAccountStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<
    number | "All" | "Ungrouped"
  >("All");

  // Modals State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isGroupManagerOpen, setIsGroupManagerOpen] = useState(false);

  const [isChecking, setIsChecking] = useState(false);

  // Account Editing State
  const [editingAccount, setEditingAccount] =
    useState<AccountWithGroups | null>(null);

  const handleCheckAllStatus = async () => {
    if (isChecking) return;

    setIsChecking(true);
    try {
      // Invoke backend to verify cookies/tokens for all accounts
      await window.electron.ipcRenderer.invoke(IPC.CHECK_ALL_STATUS);
      // Refresh to show updated statuses (e.g. Red/Green badges)
      await refreshData();
    } catch (error) {
      console.error("Failed to check account statuses:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: no deps
  useEffect(() => {
    refreshData();
  }, []);

  // --- Group Logic ---
  const handleCreateGroup = async (name: string) => {
    await window.electron.ipcRenderer.invoke(IPC.CREATE_GROUP, name);
    refreshData();
  };

  const handleDeleteGroup = async (id: number) => {
    if (
      !confirm(
        "Are you sure? This will remove the group but keep the accounts.",
      )
    )
      return;
    await window.electron.ipcRenderer.invoke(IPC.DELETE_GROUP, id);
    // Reset filter if we deleted the currently selected group
    if (selectedGroupFilter === id) setSelectedGroupFilter("All");
    refreshData();
  };

  const handleToggleAccountGroup = async (
    accountId: number,
    groupId: number,
    isAdding: boolean,
  ) => {
    if (isAdding) {
      const result = await window.electron.ipcRenderer.invoke(
        IPC.ADD_ACC_TO_GROUP,
        accountId,
        groupId,
      );
      console.log("add to group result", result);
    } else {
      const result = await window.electron.ipcRenderer.invoke(
        IPC.REMOVE_ACC_FROM_GROUP,
        accountId,
        groupId,
      );
      console.log("remove from group result", result);
    }
    refreshData();
    // Optimization: You could optimistically update local state here instead of full refresh
  };

  // --- Filtering Logic ---
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // 1. Text Search
      const matchesSearch =
        acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountId.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Group Filter
      let matchesGroup = true;
      if (selectedGroupFilter === "Ungrouped") {
        matchesGroup = acc.groups.length === 0;
      } else if (selectedGroupFilter !== "All") {
        // Check if the account has the specific group ID
        matchesGroup = acc.groups.some((g) => g.id === selectedGroupFilter);
      }

      return matchesSearch && matchesGroup;
    });
  }, [searchTerm, selectedGroupFilter, accounts]);

  return (
    <div className="p-8 h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* --- Modals --- */}
      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => {
          setIsConnectModalOpen(false);
          refreshData();
        }}
      />

      <GroupManagerModal
        isOpen={isGroupManagerOpen}
        onClose={() => setIsGroupManagerOpen(false)}
        groups={groups}
        onCreate={handleCreateGroup}
        onDelete={handleDeleteGroup}
      />

      <AccountGroupEditor
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        account={editingAccount}
        allGroups={groups}
        onToggleGroup={handleToggleAccountGroup}
      />

      {/* --- Header --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Account Management
          </h1>
          <p className="opacity-60 font-medium">
            Monitoring {accounts.length} automated profile nodes.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCheckAllStatus}
            disabled={isChecking}
            className="btn btn-outline shadow-sm gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`}
            />
            {isChecking ? "Checking..." : "Check Status"}
          </button>

          <button
            type="button"
            onClick={() => setIsGroupManagerOpen(true)}
            className="btn btn-neutral shadow-lg gap-2"
          >
            <Icons.Settings className="w-5 h-5" />
            Manage Groups
          </button>
          <button
            type="button"
            onClick={() => setIsConnectModalOpen(true)}
            className="btn btn-primary shadow-lg gap-2"
          >
            <Icons.Plus className="w-5 h-5" />
            New Account
          </button>
        </div>
      </header>

      {/* --- Control Bar --- */}
      <div className="card bg-base-100 border border-base-300 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <label className="input input-bordered flex items-center gap-2 flex-1 w-full">
          <Icons.Search className="w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="grow"
          />
        </label>

        <div className="join w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setSelectedGroupFilter("All")}
            className={`join-item btn btn-sm ${selectedGroupFilter === "All" ? "btn-neutral" : "btn-ghost border-base-300"}`}
          >
            All
          </button>

          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroupFilter(g.id)}
              className={`join-item btn btn-sm ${selectedGroupFilter === g.id ? "btn-neutral" : "btn-ghost border-base-300"}`}
            >
              {g.name}
            </button>
          ))}

          <button
            onClick={() => setSelectedGroupFilter("Ungrouped")}
            className={`join-item btn btn-sm ${selectedGroupFilter === "Ungrouped" ? "btn-neutral" : "btn-ghost border-base-300"}`}
          >
            Ungrouped
          </button>
        </div>
      </div>

      {/* --- Grid --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className="card-body p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="avatar w-9">
                      <img
                        src={account.avatar || "default_avatar_url"}
                        alt={account.username}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold truncate w-32">
                        {account.username}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`badge badge-xs ${
                      account.status ? "badge-success" : "badge-error"
                    }`}
                  />
                </div>

                {/* Display Tags */}
                <div className="flex flex-wrap gap-1 min-h-[1.5rem] mb-2">
                  {account.groups.length > 0 ? (
                    account.groups.slice(0, 3).map((g) => (
                      <span
                        key={g.id}
                        className="badge badge-xs badge-secondary badge-outline"
                      >
                        {g.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] opacity-40 italic">
                      No groups
                    </span>
                  )}
                  {account.groups.length > 3 && (
                    <span className="badge badge-xs badge-ghost">
                      +{account.groups.length - 3}
                    </span>
                  )}
                </div>

                <div className="card-actions justify-between items-center border-t border-base-200 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold opacity-50">
                      {account.platform}
                    </span>
                  </div>

                  <div className="flex gap-1 opacity-100 transition-opacity">
                    {/* EDIT GROUPS BUTTON */}
                    <button
                      type="button"
                      className="btn btn-ghost btn-circle btn-xs tooltip"
                      data-tip="Edit Groups"
                      onClick={() => setEditingAccount(account)}
                    >
                      <Edit className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-circle btn-xs text-error"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
