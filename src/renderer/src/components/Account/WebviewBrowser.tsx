import type { DidNavigateEvent, WebviewTag } from "electron";

import { useRef, useEffect } from "react";

export default function WebviewBrowser() {
  const webviewRef = useRef<WebviewTag>(null);

  useEffect(() => {
    const webview = webviewRef.current;

    if (!webview) return;

    const handleDomReady = async () => {
      try {
        const guestId = webview.getWebContentsId();
        // const saveCookieResult = await window.electron.ipcRenderer.invoke(
        //   "save-cookies",
        //   guestId,
        // );
        // console.log("saveCookieResult", saveCookieResult);
        const loadCookieResult = await window.electron.ipcRenderer.invoke(
          "load-cookies",
          guestId,
        );
        console.log("loadCookieResult", loadCookieResult);
      } catch (error) {
        console.error("Failed to execute JS in webview:", error);
      }
    };
    const handleAttach = async () => {
      // Now it is safe to get the ID
      const guestId = webview.getWebContentsId();
      console.log("Webview attached with ID:", guestId);
    };

    webview.addEventListener("did-attach", handleAttach);

    const handleNavigation = async (e: DidNavigateEvent) => {
      const currentUrl = e.url;
      console.log("Navigated to:", currentUrl);

      // 2. Logic to detect successful login
      // You can check the URL, or you can check if a specific cookie exists
      if (currentUrl.includes("new/home")) {
        console.log(currentUrl);
        const cookies = await webview.executeJavaScript("document.cookie");
        console.log("authenicate cookie", cookies);
      }
    };

    webview.addEventListener("dom-ready", handleDomReady);

    webview.addEventListener("did-navigate", handleNavigation);

    return () => {
      webview.removeEventListener("dom-ready", handleDomReady);
      webview.removeEventListener("did-navigate", handleNavigation);

      webview.removeEventListener("did-attach", handleAttach);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <webview
        ref={webviewRef}
        src="https://creator.xiaohongshu.com"
        className="flex-1 border-none"
      />
    </div>
  );
}
