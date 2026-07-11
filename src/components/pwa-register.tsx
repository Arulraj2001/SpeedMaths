"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("SpeedMaths PWA Service Worker registered scopes:", reg.scope);
          })
          .catch((err) => {
            console.error("SpeedMaths PWA Service Worker registration failures:", err);
          });
      });
    }
  }, []);

  return null;
}
