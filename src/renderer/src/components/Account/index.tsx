import { useState, useMemo } from "react";
import { MOCK_ACCOUNTS } from "../../data";
import { SocialPlatform, AccountStatus } from "../../types";
import * as Icons from "../Icons";
import { ConnectAccountModal } from "./ConnectAccountModal";

export default function Account() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const groups = useMemo(() => {
    const g = new Set(MOCK_ACCOUNTS.map((a) => a.group || "Ungrouped"));
    return ["All", ...Array.from(g)];
  }, []);

  const filteredAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter((acc) => {
      const matchesSearch =
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.handle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup =
        selectedGroup === "All" || acc.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchTerm, selectedGroup]);

  return (
    <div className="p-8 h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      <ConnectAccountModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Account Management
          </h1>
          <p className="opacity-60 font-medium">
            Monitoring {MOCK_ACCOUNTS.length} automated profile nodes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsConnectModalOpen(true)}
          className="btn btn-primary shadow-lg gap-2"
        >
          <Icons.Plus className="w-5 h-5" />
          Add Connection
        </button>
      </header>

      {/* Control Bar */}
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

        <div className="join w-full md:w-auto">
          {groups.map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={`join-item btn btn-sm ${selectedGroup === g ? "btn-neutral" : "btn-ghost border-base-300"}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
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
                    <div className="avatar">
                      <div
                        className={`w-12 h-12 rounded-xl ${account.avatarColor} text-white flex items-center justify-center font-bold text-xl ring ring-base-100 ring-offset-base-100`}
                      >
                        {account.name[0]}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold truncate w-32">
                        {account.name}
                      </h3>
                      <p className="text-xs opacity-50">{account.handle}</p>
                    </div>
                  </div>
                  <div
                    className={`badge badge-xs ${
                      account.status === AccountStatus.CONNECTED
                        ? "badge-success"
                        : "badge-error animate-pulse"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 my-4">
                  <div className="bg-base-200 rounded-lg p-2 text-center border border-base-300/50">
                    <p className="text-[10px] uppercase opacity-40 font-bold">
                      Followers
                    </p>
                    <p className="text-xs font-mono font-bold">
                      {(account.followers / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-2 text-center border border-base-300/50">
                    <p className="text-[10px] uppercase opacity-40 font-bold">
                      Posts
                    </p>
                    <p className="text-xs font-mono font-bold">
                      {account.postsCount}
                    </p>
                  </div>
                </div>

                <div className="card-actions justify-between items-center border-t border-base-200 pt-3">
                  <div className="flex items-center gap-2">
                    {account.platform === SocialPlatform.XHS ? (
                      <Icons.XhsLogo className="w-4 h-4 text-xhs" />
                    ) : (
                      <Icons.TikTokLogo className="w-4 h-4 text-tiktok" />
                    )}
                    <span className="badge badge-sm badge-ghost text-[10px]">
                      {account.group}
                    </span>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="btn btn-ghost btn-circle btn-xs"
                    >
                      <Icons.Link className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-circle btn-xs text-error"
                    >
                      <Icons.Trash2 className="w-3 h-3" />
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
