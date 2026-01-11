import type { AccountWithGroups, Group } from "@common/types";

interface Props {
  account: AccountWithGroups | null;
  allGroups: Group[];
  isOpen: boolean;
  onClose: () => void;
  onToggleGroup: (
    accountId: string,
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
  if (!isOpen || !account) return null;

  // Helper to check if account is currently in a group
  const isInGroup = (groupId: number) =>
    account.groups.some((g) => g.id === groupId);

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
            const active = isInGroup(group.id);
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
                  onChange={(e) =>
                    onToggleGroup(account.accountId, group.id, e.target.checked)
                  }
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
