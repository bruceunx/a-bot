import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="h-full overflow-hidden bg-base-300" data-theme="light">
      <main className="h-screen grid  grid-rows-[auto_1fr]">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
