"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Send } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast("Please enter a valid email address.", "error");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email format.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast("Thank you for subscribing! Free mental maths hacks are heading to your inbox.", "success");
      setEmail("");
    }, 1200);
  };

  const footerLinks = {
    explore: [
      { label: "Times Tables", href: "/tables" },
      { label: "Squares Table", href: "/squares" },
      { label: "Cubes Table", href: "/cubes" },
      { label: "Fractions & Decimals", href: "/fractions" },
    ],
    features: [
      { label: "Powers Table", href: "/powers" },
      { label: "Types of Numbers", href: "/types-of-numbers" },
      { label: "Practice Cockpit", href: "/practice" },
      { label: "Score Analytics", href: "/analytics" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Speed Maths Blog", href: "/blog" },
      { label: "Contact Support", href: "/contact" },
      { label: "FAQ Portal", href: "/faq" },
      { label: "Visual Sitemap", href: "/sitemap" },
    ],
  };

  return (
    <footer className="border-t border-border/40 bg-secondary/20 dark:bg-card/20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-sm">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                SpeedMaths
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Accelerate your mental computation skills. Built for students, test candidates, and STEM professionals. Master mental math with daily workouts.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/Arulraj2001/SpeedMaths" 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors" 
                aria-label="GitHub Repository"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors" 
                aria-label="Twitter Account"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors" 
                aria-label="LinkedIn Page"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
                Explore Math
              </h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.explore.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
                Features
              </h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.features.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1 mt-8 sm:mt-0">
              <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter placeholder */}
        <div id="newsletter" className="mt-12 border-t border-border/40 pt-8 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h3 className="text-base font-semibold text-foreground">
              Subscribe to the Mental Math Hacks newsletter
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Weekly curated quick math shortcuts, formulas, and power drill PDFs delivered straight to your email.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="mt-6 flex w-full max-w-md gap-2 sm:mt-0">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
              />
            </div>
            <Button
              type="submit"
              variant="premium"
              size="sm"
              loading={isSubmitting}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Subscribe
            </Button>
          </form>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border/40 pt-8 flex items-center justify-between flex-col md:flex-row gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} SpeedMaths. Designed with passion for extreme mental performance.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground flex-wrap justify-center items-center">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:underline">Disclaimer</Link>
            <span>•</span>
            <span className="font-mono text-[10px] text-muted-foreground/60">v1.4.2 • Updated July 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
