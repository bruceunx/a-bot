import type { MouseEvent } from "react";
import type { AccountWithGroups } from "@common/types";
import type { Platform } from "@common/constants";

import { useState, useMemo, useEffect } from "react";
import { useAccountStore } from "@renderer/store/useAccountStore";
import { X } from "lucide-react";
import { Icons } from "@renderer/constants/platforms";
import { Search } from "./Icons";
import CreateCenter from "./common/CreateCenter";

interface BrowserTab {
  id: number;
  accountId: string;
  account: AccountWithGroups;
}

export default function AccountCenter() {
  const { accounts, refreshData } = useAccountStore();

  const [tabs, setTabs] = useState<BrowserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // 1. Text Search
      const matchesSearch =
        acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm, accounts]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: no deps
  useEffect(() => {
    refreshData();
  }, []);

  const openTab = (account: AccountWithGroups) => {
    // Check if tab already exists
    const existingTab = tabs.find((t) => t.accountId === account.accountId);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    const newTab: BrowserTab = {
      id: account.id,
      accountId: account.accountId,
      account: account,
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (e: MouseEvent, tabId: number) => {
    e.stopPropagation();
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(
        newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null,
      );
    }
  };

  return (
    <div className="flex h-full bg-base-300/30 overflow-hidden animate-in fade-in duration-500">
      {/* Account Sidebar */}
      <div className="w-64 border-r border-base-300 flex flex-col bg-base-100/50 backdrop-blur-md">
        <div className="p-4 border-b border-base-300 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest opacity-40">
            accounts center
          </h2>
          <label className="input input-sm input-bordered flex items-center gap-2">
            <Search className="w-3 h-3 opacity-40" />
            <input
              type="text"
              placeholder="Filter accounts..."
              className="grow text-[11px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filteredAccounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => openTab(acc)}
              disabled={!acc.status}
              className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all group
                ${tabs.some((t) => t.accountId === acc.accountId) ? "bg-primary/10 border-primary/20" : "hover:bg-base-300"} ${!acc.status && "grayscale disabled:cursor-not-allowed"}
              `}
            >
              <img
                src={Icons[acc.platform]}
                alt={acc.username}
                className="size-5"
              />
              <img
                src={acc.avatar || "default_avatar_url"}
                alt={acc.username}
                className="rounded-full size-7"
              />

              <div className="flex-1 text-left truncate">
                <p className="text-[11px] font-bold truncate leading-none mb-1">
                  {acc.username}
                </p>
              </div>
              {tabs.some((t) => t.accountId === acc.accountId) && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Browser View */}
      <div className="flex-1 flex flex-col overflow-hidden mt-1.5">
        {/* Tab Bar */}
        <div className="h-10 bg-base-200 border-b border-base-300 flex items-end px-2 gap-1 overflow-x-auto custom-scrollbar shrink-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`group flex items-center gap-2 px-4 py-2 text-[11px] font-bold rounded-t-lg cursor-pointer transition-all border-x border-t min-w-[120px] max-w-[200px]
                ${
                  activeTabId === tab.id
                    ? "bg-base-100 border-base-300 text-main shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
                    : "bg-transparent border-transparent text-muted hover:bg-base-300"
                }
              `}
            >
              <img
                src={Icons[tab.account.platform.toUpperCase() as Platform]}
                alt={tab.account.username}
                className="size-3"
              />

              <span className="truncate flex-1">{tab.account.username}</span>
              <button
                onClick={(e) => closeTab(e, tab.id)}
                className="hover:cursor-pointer hover:text-base-content/50 p-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {tabs.length === 0 && (
            <div className="p-2 text-[10px] opacity-30 italic">
              No active sessions...
            </div>
          )}
        </div>

        <div className="flex-1 bg-base-100 flex flex-col relative">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`absolute inset-0 ${activeTabId === tab.id ? "block" : "hidden"}`}
            >
              <div className="w-full h-full p-10 space-y-10">
                <CreateCenter account={tab.account} />
              </div>
            </div>
          ))}

          {tabs.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-base-100">
              <p>Logo or advertisement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
