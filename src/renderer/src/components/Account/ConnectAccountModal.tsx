import type { UIParseAccount } from "@common/types";

import { LOGIN_METADATA, type Platform } from "@common/constants";
import { useState, useEffect } from "react";

import WebviewBrowser from "./WebviewBrowser";
import ProgressIndicator from "./ProgressIndicator";
import SelectPhase from "./SelectPhase";
import Logs from "./Logs";
import SuccessLogin from "./SuccessLogin";
import { ChevronLeft, X } from "lucide-react";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "select" | "webview" | "success";

export function ConnectAccountModal({
  isOpen,
  onClose,
}: ConnectAccountModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );
  const [step, setStep] = useState<Step>("select");

  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setLogs([]);
    }
  }, [isOpen]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handlePlatformSelect = (p: Platform) => {
    setSelectedPlatform(p);
    setStep("webview");
    addLog(`Initializing sandboxed browser for ${p}...`);
    addLog(`Waiting for user login on ${p} official page...`);
  };

  const handleAuth = (account: UIParseAccount) => {
    console.log("auth account:", account);
    setStep("success");
    addLog(`${account} authenticated successfully`);
  };

  const handleFinish = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open select-none">
      <div className="modal-box w-11/12 max-w-5xl p-0 bg-base-100 overflow-hidden shadow-2xl flex flex-col h-[750px] border border-base-300">
        {/* Header */}
        <div className="p-4 bg-base-200 flex justify-between items-center border-b border-base-300 shrink-0">
          <div className="flex items-center gap-2">
            {step !== "select" && step !== "success" && (
              <button
                onClick={() => setStep("select")}
                className="btn btn-ghost btn-xs btn-circle"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex flex-col">
              <h3 className="font-bold text-xs uppercase tracking-tight">
                Add Account Configration
              </h3>
              {selectedPlatform && (
                <span className="text-[10px] opacity-50">
                  Target: {LOGIN_METADATA[selectedPlatform].title}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="badge badge-outline badge-xs gap-1 opacity-50">
              <div className="w-1 h-1 rounded-full bg-success" />
              SSL Secured
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-xs btn-circle"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Progress Indicator */}
          <ProgressIndicator step={step} />

          <div className="flex-1 overflow-hidden flex">
            {step === "select" ? (
              <SelectPhase onPlatformSelect={handlePlatformSelect} />
            ) : step === "webview" ? (
              <div className="flex-1 flex flex-col p-4 gap-4 animate-in slide-in-from-bottom-4 duration-300">
                {selectedPlatform && (
                  <WebviewBrowser
                    platform={selectedPlatform}
                    onAuth={handleAuth}
                  />
                )}
                <Logs logs={logs} />
              </div>
            ) : (
              step === "success" &&
              selectedPlatform && (
                <SuccessLogin
                  platform={selectedPlatform}
                  onFinished={handleFinish}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
