import type { AccountWithGroups, Group } from "@common/types";

import { useState, useEffect } from "react";
import { Users, X } from "lucide-react";

interface Props {
  account: AccountWithGroups | null;
  allGroups: Group[];
  isOpen: boolean;
  onClose: () => void;
  onToggleGroup: (
    accountId: number,
    groupId: number,
    isAdding: boolean,
  ) => void;
}

export function AccountGroupEditor({
  account,
  allGroups,
  isOpen,
  onClose,
  onToggleGroup,
}: Props) {
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    if (account && account.groups) {
      setSelectedGroupIds(new Set(account.groups.map((g) => g.id)));
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const handleCheckboxChange = (groupId: number, isChecked: boolean) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (isChecked) next.add(groupId);
      else next.delete(groupId);
      return next;
    });
    onToggleGroup(account.id, groupId, isChecked);
  };

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle backdrop-blur-sm">
      <div className="modal-box p-0 w-full max-w-2xl bg-base-100 shadow-2xl overflow-hidden">
        {/* --- Header --- */}
        <div className="bg-base-200/50 px-6 py-4 border-b border-base-200 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="font-bold text-xl text-base-content flex items-center gap-2">
              Manage Groups
            </h3>
            <p className="text-sm text-base-content/60 mt-1">
              Assigning access for{" "}
              <span className="badge badge-neutral font-mono">
                {account.username}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost hover:bg-base-300"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- Content --- */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allGroups.map((group) => {
              const active = selectedGroupIds.has(group.id);

              return (
                <label
                  key={group.id}
                  className={`
                    group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none
                    ${
                      active
                        ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(0,0,0,0.05)]"
                        : "border-base-300 bg-base-100 hover:border-base-content/30 hover:bg-base-200/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Icon container */}
                    <div
                      className={`
                      w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                      ${active ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/50 group-hover:bg-base-300"}
                    `}
                    >
                      <Users className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col truncate">
                      <span
                        className={`font-semibold transition-colors ${active ? "text-primary" : "text-base-content"}`}
                      >
                        {group.name}
                      </span>
                      <span className="text-xs text-base-content/50 truncate">
                        ID: {group.id}
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm rounded transition-all"
                    checked={active}
                    onChange={(e) =>
                      handleCheckboxChange(group.id, e.target.checked)
                    }
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="modal-action bg-base-100 p-6 pt-2 m-0 border-t border-base-200">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary px-8" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
