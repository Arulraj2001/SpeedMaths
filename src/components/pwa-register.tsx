"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      const registerServiceWorker = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("SpeedMaths PWA Service Worker registered scopes:", reg.scope);
          })
          .catch((err) => {
            console.error("SpeedMaths PWA Service Worker registration failures:", err);
          });
      };

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(registerServiceWorker, { timeout: 4000 });
      } else {
        window.addEventListener("load", registerServiceWorker, { once: true });
      }
    }
  }, []);

  return null;
}
