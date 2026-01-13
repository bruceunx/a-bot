import type { AccountWithGroups, Group } from "@common/types";
import { useEffect, useState } from "react";

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

  // 2. Sync local state whenever the 'account' prop changes or modal opens
  useEffect(() => {
    if (account && account.groups) {
      const groupIds = new Set(account.groups.map((g) => g.id));
      setSelectedGroupIds(groupIds);
    }
  }, [account]);

  if (!isOpen || !account) return null;

  // 3. Handle local toggle logic
  const handleCheckboxChange = (groupId: number, isChecked: boolean) => {
    // Update UI immediately (Optimistic update)
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (isChecked) {
        next.add(groupId);
      } else {
        next.delete(groupId);
      }
      return next;
    });

    // Notify parent to perform API call/State update
    onToggleGroup(account.id, groupId, isChecked);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">
          Manage Groups for {account.username}
        </h3>
        <p className="text-sm opacity-70 mb-4">
          Select which groups this account belongs to.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {allGroups.map((group) => {
            const active = selectedGroupIds.has(group.id);
            return (
              <label
                key={group.id}
                className="cursor-pointer label border rounded-md hover:bg-base-200"
              >
                <span className="label-text">{group.name}</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                  checked={active}
                  onChange={(e) => {
                    handleCheckboxChange(group.id, e.target.checked);
                  }}
                />
              </label>
            );
          })}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
