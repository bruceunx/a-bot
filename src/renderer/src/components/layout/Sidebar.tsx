import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Send, Globe, Sparkles, Users } from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      id: "publisher",
      path: "/publisher",
      icon: Send,
      label: "Publisher",
    },
    { id: "content", path: "/content", icon: Sparkles, label: "AI Studio" },
    {
      id: "accounts",
      path: "/accounts",
      icon: Users,
      label: "Accounts Manager",
    },
    {
      id: "center",
      path: "/center",
      icon: Globe,
      label: "Accounts Center",
    },
  ];

  return (
    <div className="w-20 lg:w-64 bg-base-200 border-r border-base-300 flex flex-col h-full transition-all duration-300 select-none">
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-primary-content font-bold text-lg">A</span>
        </div>
        <span className="ml-1 font-bold text-xl hidden lg:block tracking-tight">
          Bot
        </span>
      </div>

      <div className="flex-1 px-2 py-4">
        <ul className="menu w-full gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`${isActive ? "active bg-primary text-primary-content shadow-md" : "hover:bg-base-300 text-base-content opacity-80 hover:opacity-100"}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium hidden lg:block">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-content hidden lg:block animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
