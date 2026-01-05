import type { WebviewTag } from "electron";
import type { DidNavigateEvent } from "electron/renderer";
import type { Platform } from "@renderer/constants/platforms";

import { useRef, useEffect, useState } from "react";
import { LOGIN_METADATA } from "@renderer/constants/platforms";

interface WebviewBrowserProps {
  platform: Platform;
}

export default function WebviewBrowser({ platform }: WebviewBrowserProps) {
  const plaformMetadata = LOGIN_METADATA[platform];

  const webviewRef = useRef<WebviewTag>(null);
  const [partition] = useState(() => `private_${platform}_${Date.now()}`);
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const checkAuthStatus = async () => {
      const authResult = await webview.executeJavaScript(
        plaformMetadata.script,
      );

      console.log("authResult", authResult);
      if (authResult.name) {
        const guestId = webview.getWebContentsId();
        const saveCookieResult = await window.electron.ipcRenderer.invoke(
          "save-cookies",
          guestId,
        );
        console.log("saveCookieResult", saveCookieResult);
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
    webview.addEventListener("did-navigate-in-page", handleDidNavigateInPage);

    return () => {
      // webview.removeEventListener("did-navigate", handleDidNavigate);
      webview.removeEventListener(
        "did-navigate-in-page",
        handleDidNavigateInPage,
      );
    };
  }, [plaformMetadata]);

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
