import type { AccountWithGroups } from "@common/types";
import type { WebviewTag } from "electron";

import { LOGIN_METADATA, type Platform } from "@common/constants";

import { useEffect, useRef, useState } from "react";

interface Props {
  account: AccountWithGroups;
}

export default function CreateCenter({ account }: Props) {
  const webviewRef = useRef<WebviewTag>(null);

  const plaformMetadata =
    LOGIN_METADATA[account.platform.toUpperCase() as Platform];

  const [partition] = useState(() => `private_${account.id}_${Date.now()}`);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleDomReady = async () => {
      try {
        const guestId = webview.getWebContentsId();
        const loadCookieResult = await window.electron.ipcRenderer.invoke(
          "load-cookies",
          guestId,
          account.cookies,
          plaformMetadata.cookie_url,
        );
        console.log("loadCookieResult", loadCookieResult);
      } catch (error) {
        console.error("Failed to execute JS in webview:", error);
      }
    };

    webview.addEventListener("dom-ready", handleDomReady);

    return () => {
      webview.removeEventListener("dom-ready", handleDomReady);
    };
    //
  }, [account, plaformMetadata]);

  return (
    <div className="flex flex-col h-screen">
      <webview
        ref={webviewRef}
        src={plaformMetadata.creator_url}
        className="flex-1 border-none"
        partition={partition}
      />
    </div>
  );
}
