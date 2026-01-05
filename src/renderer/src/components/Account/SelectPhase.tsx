import {
  LOGIN_METADATA,
  type Platform,
  type PlatformMetadata,
} from "@renderer/constants/platforms";

// 4. Component Definition
interface SelectPhaseProps {
  onPlatformSelect: (platform: Platform) => void;
}

export default function SelectPhase({ onPlatformSelect }: SelectPhaseProps) {
  const handlePlatformSelect = (key: Platform) => {
    if (onPlatformSelect) {
      onPlatformSelect(key);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-8 items-center mt-5 min-h-screen p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {(Object.entries(LOGIN_METADATA) as [Platform, PlatformMetadata][]).map(
          ([key, meta]) => (
            <button
              key={key}
              onClick={() => handlePlatformSelect(key)}
              className="
                btn h-auto min-h-[9rem] w-full flex-col gap-3 p-4
                bg-base-100 border border-base-300 rounded-box
                hover:border-primary hover:bg-base-200 hover:shadow-lg hover:-translate-y-1
                group normal-case font-normal transition-all duration-300
              "
            >
              {/* Icon Container */}
              <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                <img
                  src={meta.icon}
                  alt={`${meta.title} logo`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Text Info */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors">
                  {meta.title}
                </span>
                <span className="text-[10px] font-bold opacity-50 text-base-content/70 uppercase tracking-wider">
                  {meta.prefix.toUpperCase()}
                </span>
              </div>
            </button>
          ),
        )}
      </div>
    </div>
  );
}
