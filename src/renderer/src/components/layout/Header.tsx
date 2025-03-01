import { ChartNoAxesCombined, Edit, MenuIcon, User, UserIcon } from "lucide-react";
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
      <Link to={props.link} className="text-xl">
        {props.label}
      </Link>
    </div>
  );
}

export default function Header() {
  return (
    <header className="w-full h-20 bg-white shadow-sm px-2">
      <nav className="navbar h-full py-0  text-base-content/50">
        <div className="navbar-start gap-5">
          <ChartNoAxesCombined size="40" className="text-primary" />
          <p className="border-l-2 border-base-content/30 pl-5 text-md">1388888888</p>
        </div>
        <div className="navbar-center h-full gap-5">
          <SingleMenu icon={<MenuIcon size="20" />} label="管理中心" link="/manage" />
          <SingleMenu icon={<UserIcon size="20" />} label="账号中心" link="/account" />
          <SingleMenu icon={<Edit size="20" />} label="一键发布" link="/publish" />
        </div>
        <div className="navbar-end gap-7">
          <button type="button">开通VIP</button>
          <button type="button">
            <User size="27" className="text-primary/70" />
          </button>
        </div>
      </nav>
    </header>
  );
}
