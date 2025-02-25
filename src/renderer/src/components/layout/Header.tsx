import { MenuIcon, UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SingleMenuProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  link: string;
}

function SingleMenu(props: SingleMenuProps) {
  const location = useLocation();
  return (
    <div
      className={`h-full flex flex-col px-2 justify-center items-center ${
        location.pathname.startsWith(props.link) && "bg-primary/10 text-primary"
      } ${props.className && props.className}`}
    >
      {props.icon}
      <Link to={props.link} className="font-semibold text-xl">
        {props.label}
      </Link>
    </div>
  );
}

export default function Header() {
  return (
    <header className="w-full h-20 bg-white shadow-sm">
      <nav className="navbar h-full py-0  text-base-content">
        <div className="navbar-start">logo</div>
        <div className="navbar-center h-full gap-2">
          <SingleMenu icon={<MenuIcon className="size-7" />} label="管理中心" link="/manage" />
          <SingleMenu icon={<UserIcon className="size-7" />} label="账号中心" link="/account" />
        </div>
        <div className="navbar-end">account manager</div>
      </nav>
    </header>
  );
}
