import { LOGIN_METADATA, type Platform } from "@common/constants";
import { Check } from "lucide-react";

interface SuccessLoginProps {
  platform: Platform;
  onFinished: () => void;
}

export default function SuccessLogin({
  platform,
  onFinished,
}: SuccessLoginProps) {
  const platformMeta = LOGIN_METADATA[platform];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="absolute -inset-4 bg-success/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="w-20 h-20 bg-success text-success-content rounded-3xl flex items-center justify-center shadow-2xl relative rotate-3">
          <Check className="w-12 h-12 stroke-[3px]" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tighter">
          Connection Ready
        </h2>
        <p className="text-sm opacity-50 max-w-sm mx-auto">
          Your {platformMeta.title} account is now connected to the SocialFlow.
          You can start publishing immediately.
        </p>
      </div>
      <button
        onClick={onFinished}
        className="btn btn-primary btn-lg w-full max-w-sm shadow-2xl"
      >
        Finished
      </button>
    </div>
  );
}
