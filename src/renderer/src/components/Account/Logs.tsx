import { useEffect, useRef } from "react";
import * as Icons from "../Icons";

interface LogsProps {
  logs: string[];
}

export default function Logs({ logs }: LogsProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="h-32 bg-neutral text-neutral-content rounded-xl p-3 font-mono text-[10px] overflow-y-auto border border-white/5 shadow-2xl shrink-0">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/10 opacity-50">
        <Icons.Bot className="w-3 h-3" />
        <span>ENGINE_LOGS_V3.1</span>
      </div>
      {logs.map((log, i) => (
        <div
          key={i}
          className="mb-0.5 animate-in fade-in slide-in-from-left-2 duration-300"
        >
          <span className="opacity-40 mr-2">$</span>
          <span
            className={log.includes("CRITICAL") ? "text-warning font-bold" : ""}
          >
            {log}
          </span>
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}
