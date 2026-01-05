interface ProgressIndicatorProps {
  step: string;
}

export default function ProgressIndicator({ step }: ProgressIndicatorProps) {
  return (
    <div className="p-3 flex justify-center border-b border-base-300 bg-base-100 shrink-0">
      <ul className="steps steps-horizontal w-full max-w-2xl text-[10px] font-bold">
        <li
          className={`step ${["select", "webview", "verifying", "success"].includes(step) ? "step-primary" : ""}`}
        >
          Target
        </li>
        <li
          className={`step ${["webview", "verifying", "success"].includes(step) ? "step-primary" : ""}`}
        >
          Interactive Login
        </li>
        <li
          className={`step ${["verifying", "success"].includes(step) ? "step-primary" : ""}`}
        >
          Token Extraction
        </li>
        <li
          className={`step ${["success"].includes(step) ? "step-primary" : ""}`}
        >
          Ready
        </li>
      </ul>
    </div>
  );
}
