import { useEffect, useRef, useState } from "react";
import type { AccountWithGroups, UIParseAccount } from "@common/types";
import type { DidNavigateEvent } from "electron/renderer";

import { IPC } from "@renderer/constants/ipc";
import { AlertCircle, X } from "lucide-react";
import { LOGIN_METADATA, Platform } from "@common/constants";

interface ReauthAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: AccountWithGroups | null;
}

export default function ReauthAccountModal({
  isOpen,
  onClose,
  account,
}: ReauthAccountModalProps) {
  const webviewRef = useRef<Electron.WebviewTag>(null);

  const [error, setError] = useState<string | null>(null);

  const [partition] = useState(() => `private_$_${Date.now()}`);

  const plaformMetadata =
    LOGIN_METADATA[account?.platform ?? Platform.BILIBILI];

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !account) return;

    const checkAuthStatus = async () => {
      const authResult: UIParseAccount = await webview.executeJavaScript(
        plaformMetadata.script,
      );

      console.log("authResult", authResult);
      if (authResult.accountId) {
        const guestId = webview.getWebContentsId();
        const saveCookieResult = await window.electron.ipcRenderer.invoke(
          IPC.SAVE_ACCOUNT,
          guestId,
          authResult,
          plaformMetadata.prefix,
        );
        console.log("saveCookieResult", saveCookieResult);
        if (authResult.accountId === account.accountId) {
          // update cookies for user
          onClose();
        } else {
          setError(
            "You reauth the wrong account, please add the account independently!",
          );
        }
      }
    };

    const handleDidNavigateInPage = (e: DidNavigateEvent) => {
      console.log("In-Page Navigate:", e.url);
      setTimeout(checkAuthStatus, 2000);
    };

    webview.addEventListener("did-navigate-in-page", handleDidNavigateInPage);

    return () => {
      // webview.removeEventListener("did-navigate", handleDidNavigate);
      //
      // webview.removeEventListener("dom-ready", handleDomReady);
      webview.removeEventListener(
        "did-navigate-in-page",
        handleDidNavigateInPage,
      );
    };
  }, [plaformMetadata, onClose, account]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl h-[80vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-base-300">
          <div>
            <h3 className="font-bold text-lg">Re-authenticate Account</h3>
            <div className="mt-2 flex items-center gap-2">
              <div className="avatar w-8">
                <img
                  src={account?.avatar || "default_avatar_url"}
                  alt={account?.username}
                  className="rounded-full"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{account?.username}</p>
                <p className="text-xs opacity-60">ID: {account?.accountId}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="alert alert-warning m-4 mb-0">
          <AlertCircle className="w-5 h-5" />
          <div className="text-sm">
            <strong>Important:</strong> You must log in with the account{" "}
            <strong>{account?.username}</strong> (ID: {account?.accountId}).
            Logging in with a different account will fail.
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error m-4 mb-0">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Webview Container */}
        <div className="flex-1 relative m-4 border border-base-300 rounded-lg overflow-hidden">
          <div className="flex flex-col h-screen">
            <webview
              ref={webviewRef}
              src={plaformMetadata.url}
              className="flex-1 border-none"
              partition={partition}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
