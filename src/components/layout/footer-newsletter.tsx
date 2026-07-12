"use client";

import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/toast";

export function FooterNewsletter() {
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

  return (
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
  );
}