"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Target, CheckSquare, TrendingUp,
  Sparkles, Moon, RefreshCw, LogOut, Menu, X, User
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Today", icon: LayoutDashboard },
  { href: "/pillars", label: "Pillars", icon: Target },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/momentum", label: "Momentum", icon: TrendingUp },
  { href: "/identity", label: "Identity", icon: Sparkles },
  { href: "/reflect", label: "Reflect", icon: Moon },
  { href: "/reset", label: "Reset", icon: RefreshCw },
];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null };
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 fixed left-0 top-0 bottom-0 bg-white/60 backdrop-blur-md border-r border-cream-300 z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center shadow-glow flex-shrink-0">
              <span className="text-base">✦</span>
            </div>
            <div>
              <p className="font-display font-bold text-gray-800 text-lg leading-none">ASCEND</p>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">Life OS</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 group",
                  active
                    ? "bg-coral-500 text-white shadow-glow"
                    : "text-gray-500 hover:bg-cream-200 hover:text-gray-700"
                )}
              >
                <Icon size={17} className={cn("flex-shrink-0", active ? "text-white" : "text-gray-400 group-hover:text-coral-400 transition-colors")} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-cream-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-200 to-gold-300 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-coral-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-coral-500 hover:bg-coral-50 transition-all"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-cream-200 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center">
            <span className="text-sm">✦</span>
          </div>
          <span className="font-display font-bold text-gray-800">ASCEND</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600">
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center">
                    <span className="text-lg">✦</span>
                  </div>
                  <span className="font-display font-bold text-gray-800 text-xl">ASCEND</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                        active ? "bg-coral-500 text-white" : "text-gray-500 hover:bg-cream-200"
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-4 py-4 border-t border-cream-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-coral-200 to-gold-300 flex items-center justify-center">
                    <User size={15} className="text-coral-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-coral-500 hover:bg-coral-50 transition-all"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
