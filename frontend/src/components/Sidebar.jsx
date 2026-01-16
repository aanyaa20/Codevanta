import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Clock,
  Settings,
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
      className={`relative h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        border-r border-slate-700/50
        transition-all duration-300 flex flex-col shadow-2xl z-50
        ${collapsed ? "w-20" : "w-[240px]"}`}
    >
      {/* ================= Brand Header ================= */}
      <div
        className={`h-16 flex items-center border-b border-slate-700/50
          ${collapsed ? "justify-center px-4" : "px-6"}`}
      >
        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
          className="flex items-center gap-3 group"
        >
          <img 
            src="/logo.png" 
            alt="CodeVanta Logo" 
            className="w-9 h-9 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.7)] transition-all"
          />

          {!collapsed && (
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
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
                transition-all duration-200 relative group
                ${
                  active
                    ? "bg-gradient-to-r from-cyan-600/80 to-teal-600/80 text-white font-medium shadow-lg shadow-cyan-500/30"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                }`}
            >
              <item.icon className={`size-5 shrink-0 ${active ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'group-hover:text-cyan-400'}`} />

              {!collapsed && <span>{item.label}</span>}

              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2
                  w-1 h-8 bg-gradient-to-b from-cyan-400 to-teal-400 rounded-r-full
                  shadow-[0_0_10px_rgba(6,182,212,1)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ================= User Section ================= */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div
          className={`flex items-center gap-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "size-9 rounded-full ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/30"
              }
            }}
          />

          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-slate-200">
                {user?.firstName || "Developer"}
              </p>
              <p className="text-xs text-slate-500 truncate">
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
          size-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500
          text-white flex items-center justify-center
          shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/60 hover:scale-105 transition-all z-50"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>
    </aside>
  );
}

export default Sidebar;
