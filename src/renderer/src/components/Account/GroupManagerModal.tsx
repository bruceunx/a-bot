import { useState } from "react";
import * as Icons from "../Icons";
import type { Group } from "@common/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groups: Group[];
  onCreate: (name: string) => void;
  onDelete: (id: number) => void;
}

export function GroupManagerModal({
  isOpen,
  onClose,
  groups,
  onCreate,
  onDelete,
}: Props) {
  const [newGroupName, setNewGroupName] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newGroupName.trim()) return;
    onCreate(newGroupName);
    setNewGroupName("");
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Manage Groups</h3>

        {/* Create Group */}
        <div className="join w-full mb-6">
          <input
            className="input input-bordered join-item w-full"
            placeholder="New Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <button className="btn btn-primary join-item" onClick={handleCreate}>
            Add
          </button>
        </div>

        {/* List Groups */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {groups.length === 0 && (
            <p className="text-center opacity-50">No groups created yet.</p>
          )}

          {groups.map((group) => (
            <div
              key={group.id}
              className="flex justify-between items-center p-2 bg-base-200 rounded-lg"
            >
              <span className="font-medium">{group.name}</span>
              <button
                onClick={() => onDelete(group.id)}
                className="btn btn-ghost btn-xs text-error"
                title="Delete Group"
              >
                <Icons.Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
