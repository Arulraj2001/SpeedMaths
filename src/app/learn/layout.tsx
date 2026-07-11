"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Sparkles, Table2, Square, Box, Percent, TrendingUp, Hash, 
  ArrowLeft, Menu, X, Sun, Moon, ChevronDown, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { numberTypes } from "@/data/number-types";
import { cn } from "@/lib/utils";

export default function LearnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNumberTypesExpanded, setIsNumberTypesExpanded] = useState(false);

  // Set mounted state
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Auto-expand Number Types sub-menu if path is a number-type
  useEffect(() => {
    if (pathname?.includes("/learn/number-types")) {
      const timer = setTimeout(() => setIsNumberTypesExpanded(true), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    const timer = setTimeout(() => setIsMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const menuItems = [
    { href: "/learn/tables", label: "Times Tables", icon: <Table2 className="h-4.5 w-4.5" /> },
    { href: "/learn/squares", label: "Squares (1-100)", icon: <Square className="h-4.5 w-4.5" /> },
    { href: "/learn/cubes", label: "Cubes (1-50)", icon: <Box className="h-4.5 w-4.5" /> },
    { href: "/learn/powers", label: "Power Tables", icon: <TrendingUp className="h-4.5 w-4.5" /> },
    { href: "/learn/fractions", label: "Fractions Decimals", icon: <Percent className="h-4.5 w-4.5" /> },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Workspace Brand Logo */}
        <div className="flex items-center justify-between pb-4 border-b border-border/30">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-sm">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              SpeedMaths
            </span>
          </Link>
          <button 
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="space-y-4">
          <div className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Core Modules
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Number Types Collapsible Accordion Menu */}
            <div>
              <button
                onClick={() => setIsNumberTypesExpanded(!isNumberTypesExpanded)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground cursor-pointer transition-colors",
                  pathname?.includes("/learn/number-types") && "text-foreground font-semibold"
                )}
              >
                <div className="flex items-center gap-3">
                  <Hash className="h-4.5 w-4.5" />
                  <span>Number Types</span>
                </div>
                {isNumberTypesExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isNumberTypesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-7 pr-1 mt-1 space-y-0.5 border-l border-border/40 ml-5 max-h-[40vh] overflow-y-auto custom-scrollbar"
                  >
                    {/* Index List Link */}
                    <Link
                      href="/learn/number-types"
                      className={cn(
                        "block px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors",
                        pathname === "/learn/number-types"
                          ? "bg-secondary text-primary font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Catalogue Overview
                    </Link>
                    
                    {/* Subpages Links */}
                    {numberTypes.map((type) => {
                      const href = `/learn/number-types/${type.id}`;
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={type.id}
                          href={href}
                          className={cn(
                            "block px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors",
                            isActive
                              ? "bg-secondary text-primary font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {type.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
      </div>

      {/* Return Home Button */}
      <div className="pt-4 border-t border-border/30">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Exit Workspace</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border/40 bg-card/60 backdrop-blur-md">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-950/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative flex w-full max-w-xs flex-col bg-card border-r border-border/40"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Workspace header bar */}
        <header className="flex h-16 items-center justify-between border-b border-border/40 px-4 md:px-6 bg-card/10 backdrop-blur-sm relative z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>
            <div className="text-xs font-semibold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
              <span>Learn Workspace</span>
              <span className="text-border">/</span>
              <span className="text-foreground capitalize">
                {pathname?.split("/").pop()?.replace("-", " ") || "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5 text-amber-500" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-indigo-600" />
                )}
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Workstation Panel */}
        <main className="flex-grow overflow-y-auto relative z-10 grid-bg focus:outline-none">
          <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
