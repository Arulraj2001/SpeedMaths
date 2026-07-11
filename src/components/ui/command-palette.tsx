"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Terminal, Moon, Sun, Calculator, ArrowRight, Table2, Square, Box, Percent, TrendingUp, PlusCircle, MinusCircle, HelpCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useToast } from "./toast";
import { topics } from "@/data/topics";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectTopic,
}: CommandPaletteProps) {
  const [mounted, setMounted] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { setTheme } = useTheme();
  const { toast } = useToast();

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  // Map icon names to Lucide icons
  const getIcon = (name: string) => {
    const map: Record<string, React.ReactNode> = {
      Table2: <Table2 className="h-4 w-4" />,
      Square: <Square className="h-4 w-4" />,
      Box: <Box className="h-4 w-4" />,
      Percent: <Percent className="h-4 w-4" />,
      TrendingUp: <TrendingUp className="h-4 w-4" />,
      PlusCircle: <PlusCircle className="h-4 w-4" />,
      MinusCircle: <MinusCircle className="h-4 w-4" />,
      Multiply: <Sparkles className="h-4 w-4" />,
      Divide: <Calculator className="h-4 w-4" />,
      Shuffle: <Sparkles className="h-4 w-4" />,
      Hash: <Calculator className="h-4 w-4" />,
    };
    return map[name] || <Calculator className="h-4 w-4" />;
  };

  // Compile list of available commands
  const commands = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: "Topics" | "Actions";
      icon: React.ReactNode;
      action: () => void;
    }> = [];

    // Add topics
    topics.forEach((t) => {
      list.push({
        id: `topic-${t.id}`,
        title: t.title,
        subtitle: `${t.difficulty} Difficulty • ${t.estQuestions} Questions`,
        category: "Topics",
        icon: getIcon(t.iconName),
        action: () => {
          onSelectTopic(t.id);
          onClose();
        },
      });
    });

    // Add general actions
    list.push(
      {
        id: "action-theme-dark",
        title: "Switch to Dark Mode",
        subtitle: "Change theme to obsidian dark mode",
        category: "Actions",
        icon: <Moon className="h-4 w-4" />,
        action: () => {
          setTheme("dark");
          toast("Switched to Dark Mode!", "success");
          onClose();
        },
      },
      {
        id: "action-theme-light",
        title: "Switch to Light Mode",
        subtitle: "Change theme to crisp light mode",
        category: "Actions",
        icon: <Sun className="h-4 w-4" />,
        action: () => {
          setTheme("light");
          toast("Switched to Light Mode!", "success");
          onClose();
        },
      },
      {
        id: "action-faq",
        title: "Scroll to FAQs",
        subtitle: "Learn more about SpeedMaths",
        category: "Actions",
        icon: <HelpCircle className="h-4 w-4" />,
        action: () => {
          const faqEl = document.getElementById("faq");
          if (faqEl) faqEl.scrollIntoView({ behavior: "smooth" });
          onClose();
        },
      },
      {
        id: "action-newsletter",
        title: "Subscribe to Newsletter",
        subtitle: "Get free mental math hacks and resources",
        category: "Actions",
        icon: <Mail className="h-4 w-4" />,
        action: () => {
          const newsEl = document.getElementById("newsletter");
          if (newsEl) newsEl.scrollIntoView({ behavior: "smooth" });
          onClose();
        },
      }
    );

    // Filter based on search query
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, onSelectTopic, onClose, setTheme, toast]);

  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % commands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + commands.length) % commands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (commands[activeIndex]) {
          commands[activeIndex].action();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, commands, onClose]);

  // Lock body scroll when active
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const modalRoot = document.body;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-950/60 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl glassmorphism flex flex-col max-h-[60vh]"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search topics, settings, or actions..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(0);
                }}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-2">
              {commands.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No options found for &ldquo;{search}&rdquo;.
                </div>
              ) : (
                <div className="space-y-4">
                  {["Topics", "Actions"].map((category) => {
                    const categoryItems = commands.filter((c) => c.category === category);
                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={category} className="space-y-1">
                        <div className="px-3 py-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          {category}
                        </div>
                        {categoryItems.map((item) => {
                          const globalIndex = commands.findIndex((c) => c.id === item.id);
                          const isSelected = activeIndex === globalIndex;

                          return (
                            <button
                              key={item.id}
                              onClick={item.action}
                              onMouseEnter={() => setActiveIndex(globalIndex)}
                              className={cn(
                                "w-full text-left flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-secondary text-foreground"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "p-1.5 rounded-md",
                                    isSelected
                                      ? "bg-primary-foreground/15 text-primary-foreground"
                                      : "bg-secondary text-muted-foreground"
                                  )}
                                >
                                  {item.icon}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-semibold">
                                    {item.title}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-xs leading-normal",
                                      isSelected
                                        ? "text-primary-foreground/75"
                                        : "text-muted-foreground"
                                    )}
                                  >
                                    {item.subtitle}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <ArrowRight className="h-4 w-4 animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div className="border-t border-border/50 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground bg-secondary/30">
              <div className="flex items-center gap-2">
                <Terminal className="h-3 w-3" />
                <span>Use Arrow keys & Enter to run commands</span>
              </div>
              <div>
                <span>Ctrl + K to toggle anywhere</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalRoot
  );
}
