import { useEffect, useRef } from "react";
import AccountMenu from "./AccountMenu";

export default function Account() {
  const webviewRef = useRef<HTMLWebViewElement>(null);

  const getCookies = async () => {
    const webview = webviewRef.current;
    if (webview) {
      const id = webview.getWebContentsId();
      const result = await window.api.getWebContentsWithSession(id);

      console.log("webcontent", result);
    } else {
      console.warn("WebContents not ready");
    }
  };

  useEffect(() => {
    if (webviewRef.current) {
      console.log(webviewRef.current);
      webviewRef.current.addEventListener("did-finish-load", () => {
        console.log("Webview loaded!");
        getCookies();
      });
    }
  }, []);

  return (
    <section id="body" className="h-full grid  grid-cols-[auto_1fr]">
      <AccountMenu />
      <div className="p-2">
        <webview
          ref={webviewRef}
          src="https://www.baidu.com"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </section>
  );
}
