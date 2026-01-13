import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Clock,
  Settings,
  Code2,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { useState } from "react";

function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { user } = useUser();
  
  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/problems", icon: BookOpen, label: "Problems" },
    { path: "/sessions/history", icon: Clock, label: "History" },
    { path: "/sessions/active", icon: Users, label: "Live Sessions" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`h-screen bg-white border-r border-[var(--border-subtle)] transition-all duration-300 flex flex-col z-50 shadow-sm
        ${collapsed ? "w-20" : "w-[240px]"}`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)] bg-white/50 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-3 group w-full">
          <div className="size-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <Code2 className="size-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">CodeVanta</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative mb-1 ${
                active 
                  ? "bg-orange-50 text-[var(--accent-primary)] font-medium" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <item.icon className={`size-5 shrink-0 ${active ? "text-[var(--accent-primary)]" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]"}`} />
              
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              
              {active && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent-primary)] rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "size-9 rounded-full ring-2 ring-white shadow-sm"
              }
            }}
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-[var(--text-primary)]">
                {user?.firstName || "Developer"}
              </p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 size-6 bg-white border border-[var(--border-subtle)] rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all shadow-sm z-50"
      >
        {collapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
      </button>
    </aside>
  );
}

export default Sidebar;
