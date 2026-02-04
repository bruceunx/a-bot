export default function Profile() {
  return (
    <div className="p-4 border-t border-base-300 flex flex-col gap-4">
      <div className="bg-base-300 rounded-xl p-3 flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
            <span className="text-xs">PRO</span>
          </div>
        </div>
        <div className="hidden lg:block overflow-hidden">
          <p className="text-sm font-bold truncate">Professional</p>
          <p className="text-xs opacity-60 truncate">user@socialflow.ai</p>
        </div>
      </div>
    </div>
  );
}
