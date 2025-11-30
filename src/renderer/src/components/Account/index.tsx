import { useCallback, useEffect, useRef, useState } from "react";
import AccountMenu from "./AccountMenu";

export default function Account() {
  const webviewRef = useRef<HTMLWebViewElement>(null);
  const [cookiesLoaded, setCookiesLoaded] = useState(false);

  const checkLoginStatus = useCallback(async () => {
    const webview = webviewRef.current as Electron.WebviewTag | null;
    if (webview) {
      const id = webview.getWebContentsId();
      const url = webview.getURL();
      const html = await webview.executeJavaScript("document.documentElement.outerHTML");
      const isAuth =
        url.includes("bilibili.com") &&
        !html.includes('<div class="header-login-entry"><span> 登录 </span></div>');
      const cookies = await window.api.getCookies(id);
      console.log(cookies);
      if (isAuth) {
        const saveResult = await window.api.saveCookies(id);
        console.log("url with saveCookies result", url, saveResult);
      }
    } else {
      console.warn("WebContents not ready");
    }
  }, []);

  useEffect(() => {
    const webview = webviewRef.current as Electron.WebviewTag | null;
    if (!webview) return;

    const handleFinish = () => checkLoginStatus();

    webview.addEventListener("did-finish-load", handleFinish);

    return () => {
      webview.removeEventListener("did-finish-load", handleFinish);
    };
  }, [checkLoginStatus]);

  useEffect(() => {
    const webview = webviewRef.current as Electron.WebviewTag | null;
    if (!webview) return;
    const handleDomReady = async () => {
      if (cookiesLoaded) return;
      const id = webview.getWebContentsId();
      const loadResult = await window.api.loadCookies(id);
      setCookiesLoaded(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("load result", loadResult);
      webview.loadURL("https://www.bilibili.com/");
    };

    webview.addEventListener("dom-ready", handleDomReady);
    return () => {
      webview.removeEventListener("dom-ready", handleDomReady);
    };
  }, [cookiesLoaded]);

  return (
    <section id="body" className="h-full grid  grid-cols-[auto_1fr]">
      <AccountMenu />
      <div className="p-2">
        <webview
          ref={webviewRef}
          // src="https://space.bilibili.com"
          src="about:blank"
          style={{
            width: "100%",
            height: "100%"
          }}
        />
      </div>
    </section>
  );
}
