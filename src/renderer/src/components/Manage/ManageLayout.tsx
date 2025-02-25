import { Outlet } from "react-router-dom";
import VerticalNavigationMenu from "../common/VerticalNavigationMenu";

export default function ManageLayout() {
  return (
    <section id="body" className="h-full grid  grid-cols-[auto_1fr]">
      <VerticalNavigationMenu />
      <Outlet />
    </section>
  );
}
