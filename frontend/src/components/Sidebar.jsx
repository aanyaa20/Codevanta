import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Clock,
  Settings,
  Code2,
  ChevronLeft,
  ChevronRight,
  VideoIcon
} from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";

function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/problems", icon: BookOpen, label: "Problems" },
    { path: "/sessions/history", icon: Clock, label: "History" },
    { path: "/sessions/active", icon: Users, label: "Live Sessions" },
    { path: "/recordings", icon: VideoIcon, label: "Recorded Sessions" },
    { path: "/settings", icon: Settings, label: "Settings" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`relative h-screen bg-white border-r border-[var(--border-subtle)]
        transition-all duration-300 flex flex-col shadow-sm z-50
        ${collapsed ? "w-20" : "w-[240px]"}`}
    >
      {/* ================= Brand Header ================= */}
      <div
        className={`h-16 flex items-center border-b border-[var(--border-subtle)]
          ${collapsed ? "justify-center px-4" : "px-6"}`}
      >
        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
          className="flex items-center gap-3 group"
        >
          <div className="size-8 rounded-lg bg-[var(--accent-primary)]
            flex items-center justify-center shadow-md">
            <Code2 className="size-5 text-white" />
          </div>

          {!collapsed && (
            <span className="font-bold text-xl text-[var(--text-primary)]">
              CodeVanta
            </span>
          )}
        </button>
      </div>

      {/* ================= Navigation ================= */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 relative
                ${
                  active
                    ? "bg-orange-50 text-[var(--accent-primary)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-gray-100"
                }`}
            >
              <item.icon className="size-5 shrink-0" />

              {!collapsed && <span>{item.label}</span>}

              {active && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2
                  w-1 h-8 bg-[var(--accent-primary)] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ================= User Section ================= */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <div
          className={`flex items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "size-9 rounded-full ring-2 ring-white shadow-sm"
              }
            }}
          />

          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.firstName || "Developer"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= Toggle Button ================= */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-0 top-20 translate-x-1/2
          size-8 rounded-full bg-[var(--accent-primary)]
          text-white flex items-center justify-center
          shadow-lg hover:scale-105 transition z-50"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={16} />
        ) : (
          <ChevronLeft size={16} />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;
