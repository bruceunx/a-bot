import type { DidNavigateEvent, WebviewTag } from "electron";

import { useRef, useEffect, useState } from "react";

interface PageData {
  title: string;
  cookies: string;
}

export default function WebviewBrowser() {
  const webviewRef = useRef<WebviewTag>(null);
  const [pageData, setPageData] = useState<PageData>({
    title: "",
    cookies: "",
  });

  useEffect(() => {
    const webview = webviewRef.current;

    if (!webview) return;

    const handleDomReady = async () => {
      try {
        const title = await webview.executeJavaScript("document.title");

        const cookies = await webview.executeJavaScript("document.cookie");

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

        console.log("Page Loaded:", title);
        console.log("Cookies Found:", cookies);

        setPageData({
          title: typeof title === "string" ? title : "Unknown",
          cookies: typeof cookies === "string" ? cookies : "",
        });
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
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "10px", background: "#f0f0f0" }}>
        <strong>Detected Title:</strong> {pageData.title || "Loading..."} <br />
        <strong>Detected Cookies:</strong>{" "}
        {pageData.cookies || "None or HttpOnly"}
      </div>

      <webview
        ref={webviewRef}
        src="https://creator.xiaohongshu.com"
        style={{ flex: 1, border: "none" }}
      />
    </div>
  );
}
