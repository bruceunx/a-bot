import type { WebviewTag } from "electron";
import type { DidNavigateEvent } from "electron/renderer";
import type { Platform } from "@renderer/constants/platforms";
import type { Account } from "@renderer/types";

import { useRef, useEffect, useState } from "react";
import { LOGIN_METADATA } from "@renderer/constants/platforms";

interface WebviewBrowserProps {
  platform: Platform;
  onAuth: (account: Account) => void;
}

export default function WebviewBrowser({
  platform,
  onAuth,
}: WebviewBrowserProps) {
  const plaformMetadata = LOGIN_METADATA[platform];

  const webviewRef = useRef<WebviewTag>(null);
  const [partition] = useState(() => `private_${platform}_${Date.now()}`);
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    // const handleDomReady = async () => {
    //   try {
    //     const guestId = webview.getWebContentsId();
    //     const loadCookieResult = await window.electron.ipcRenderer.invoke(
    //       "load-cookies",
    //       guestId,
    //     );
    //     console.log("loadCookieResult", loadCookieResult);
    //   } catch (error) {
    //     console.error("Failed to execute JS in webview:", error);
    //   }
    // };
    //

    const checkAuthStatus = async () => {
      const authResult: Account = await webview.executeJavaScript(
        plaformMetadata.script,
      );

      console.log("authResult", authResult);
      if (authResult.accountId) {
        const guestId = webview.getWebContentsId();
        const saveCookieResult = await window.electron.ipcRenderer.invoke(
          "save-account",
          guestId,
          authResult,
          plaformMetadata.prefix,
        );
        console.log("saveCookieResult", saveCookieResult);
        onAuth(authResult);
      }
    };

    // const handleDidNavigate = (e: DidNavigateEvent) => {
    //   console.log("Full Navigate:", e.url);
    //   setTimeout(checkAuthStatus, 2000);
    // };

    const handleDidNavigateInPage = (e: DidNavigateEvent) => {
      console.log("In-Page Navigate:", e.url);
      setTimeout(checkAuthStatus, 2000);
    };

    // webview.addEventListener("did-navigate", handleDidNavigate);
    //
    // webview.addEventListener("dom-ready", handleDomReady);
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
  }, [plaformMetadata, onAuth]);

  return (
    <div className="flex flex-col h-screen">
      <webview
        ref={webviewRef}
        src={plaformMetadata.url}
        className="flex-1 border-none"
        partition={partition}
      />
    </div>
  );
}
