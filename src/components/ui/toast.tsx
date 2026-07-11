"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((item) => {
            const iconMap = {
              success: <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />,
              error: <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />,
              info: <Info className="h-5 w-5 text-indigo-500 flex-shrink-0" />,
            };

            const typeStyles = {
              success: "border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300",
              error: "border-rose-500/20 bg-rose-50/90 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300",
              info: "border-indigo-500/20 bg-indigo-50/90 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300",
            };

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`flex items-start gap-3 p-4 rounded-xl border glassmorphism shadow-lg pointer-events-auto ${
                  typeStyles[item.type || "info"]
                }`}
              >
                {iconMap[item.type || "info"]}
                <div className="flex-1 text-sm font-medium pr-2">
                  {item.message}
                </div>
                <button
                  onClick={() => removeToast(item.id)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-0.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
