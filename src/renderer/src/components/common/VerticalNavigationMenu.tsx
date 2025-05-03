import type React from "react";
import { Users, HomeIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface VerticalSingleMenuProps {
  label: string;
  icon: React.ReactNode;
  links: string[] | string;
}

function VerticalSingleMenu(props: VerticalSingleMenuProps) {
  const location = useLocation();
  const active = props.links.includes(location.pathname);
  return (
    <li className={`${active && "border-l-2 border-l-primary bg-primary/5 text-primary"}`}>
      <Link to={props.links[0]}>
        {props.icon}
        {props.label}
      </Link>
    </li>
  );
}

export default function VerticalNavigationMenu() {
  return (
    <ul className="menu bg-base-200 w-56 gap-2">
      <VerticalSingleMenu
        label="首页"
        icon={<HomeIcon className="size-5" />}
        links={["/manage", "/manage/overview"]}
      />
      <VerticalSingleMenu
        label="人员管理"
        icon={<Users className="size-5" />}
        links={["/manage/account"]}
      />
    </ul>
  );
}
