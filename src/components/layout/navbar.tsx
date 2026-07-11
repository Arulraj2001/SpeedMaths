"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Search, Moon, Sun, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { CommandPalette } from "../ui/command-palette";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut Ctrl+K to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectTopic = (topicId: string) => {
    // Dispatch custom event to let the page open the topic dialog
    const event = new CustomEvent("select-topic", { detail: { id: topicId } });
    window.dispatchEvent(event);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/learn/tables", label: "Learn" },
    { href: "/practice", label: "Practice" },
    { href: "/analytics", label: "Analytics" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            SpeedMaths
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search, Theme, CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Search Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex h-10 w-64 items-center justify-between rounded-lg border border-border/80 bg-secondary/50 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:border-primary/20 transition-all cursor-pointer shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>Search mathematical topics...</span>
            </div>
            <kbd className="inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl</span>K
            </kbd>
          </button>

          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-500 animate-pulse" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600" />
              )}
            </button>
          )}

          {/* CTA */}
          <Link href="/practice">
            <Button
              variant="premium"
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Start Practice
            </Button>
          </Link>
        </div>

        {/* Mobile Navbar Elements */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Search Button */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 hover:bg-secondary text-muted-foreground cursor-pointer"
            aria-label="Search topics"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Mobile Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 hover:bg-secondary text-muted-foreground cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600" />
              )}
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-secondary/30 hover:bg-secondary text-muted-foreground cursor-pointer"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <div className="space-y-1.5 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border/50">
                <Link href="/practice" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="premium"
                    className="w-full"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Start Practice
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectTopic={handleSelectTopic}
      />
    </header>
  );
}
