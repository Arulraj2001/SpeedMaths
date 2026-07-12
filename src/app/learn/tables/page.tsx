"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, ArrowRight, Play, Pause, Square as Stop, 
  Fullscreen, Minimize2, Copy, Share2, Printer, Bookmark, BookmarkCheck,
  Search, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function TablesPage() {
  const [num, setNum] = useState<number>(12); // Initial active table
  const [jumpInput, setJumpInput] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("speedmaths-tables-bookmarks");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Ignore
        }
      }
    }
    return [];
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceLine, setVoiceLine] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentLineRef = useRef<number>(1);

  // Stop voice speaking when table number shifts
  useEffect(() => {
    stopVoice();
  }, [num]);

  // Monitor fullscreen escapes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePrev = () => {
    if (num > 1) setNum(num - 1);
  };

  const handleNext = () => {
    if (num < 50) setNum(num + 1);
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(jumpInput);
    if (!isNaN(val) && val >= 1 && val <= 50) {
      setNum(val);
      setJumpInput("");
    } else {
      toast("Please enter a table number between 1 and 50.", "error");
    }
  };

  const toggleBookmark = () => {
    let updated: number[];
    if (bookmarks.includes(num)) {
      updated = bookmarks.filter((b) => b !== num);
      toast(`Removed Table ${num} from Bookmarks.`, "info");
    } else {
      updated = [...bookmarks, num].sort((a, b) => a - b);
      toast(`Bookmarked Table ${num}!`, "success");
    }
    setBookmarks(updated);
    localStorage.setItem("speedmaths-tables-bookmarks", JSON.stringify(updated));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const lines = Array.from({ length: 20 }, (_, i) => `${num} × ${i + 1} = ${num * (i + 1)}`);
    const text = `Times Table of ${num}\n----------------\n${lines.join("\n")}`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast(`Table ${num} copied to clipboard.`, "success");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    const shareData = {
      title: `Times Table of ${num}`,
      text: `Master mental maths: practice the times table of ${num} with SpeedMaths!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast("Page URL copied to clipboard for sharing.", "success");
      });
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById("table-container");
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Text-to-speech Voice utilities
  const startVoice = () => {
    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setIsPaused(false);
    currentLineRef.current = 1;
    speakNextLine();
  };

  const speakNextLine = () => {
    const line = currentLineRef.current;
    if (line > 20) {
      setIsSpeaking(false);
      setVoiceLine(null);
      return;
    }

    setVoiceLine(line);
    const text = `${num} times ${line} is ${num * line}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.onend = () => {
      currentLineRef.current += 1;
      speakNextLine();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setVoiceLine(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  function stopVoice() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setVoiceLine(null);
  }

  const isBookmarked = bookmarks.includes(num);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Search Header Options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border/40 backdrop-blur-sm print:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={num <= 1}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Prev Table
          </Button>
          <span className="text-sm font-bold text-muted-foreground">
            Table {num} of 50
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={num >= 50}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Next Table
          </Button>
        </div>

        {/* Jump input */}
        <form onSubmit={handleJump} className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              placeholder="Jump to table (1-50)..."
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="h-11 w-52 pl-9 pr-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
            />
          </div>
          <Button type="submit" variant="secondary" className="h-11 cursor-pointer">
            Go
          </Button>
        </form>
      </div>

      {/* Main Interactive Table Sheet Container */}
      <div
        id="table-container"
        className={cn(
          "rounded-2xl border border-border bg-card p-6 md:p-8 relative overflow-hidden transition-all duration-300",
          isFullscreen ? "fixed inset-0 z-50 flex flex-col justify-center max-w-none rounded-none p-10 bg-background overflow-y-auto" : "",
          "print:border-none print:shadow-none print:bg-white print:text-black print:p-0 print:m-0"
        )}
      >
        
        {/* Actions panel */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className="p-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label="Bookmark Table"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label="Print Table"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label="Copy Table"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label="Share Table"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Audio Speech Controls */}
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5 border border-border/40">
              <button
                onClick={startVoice}
                className={cn(
                  "p-1.5 rounded-md cursor-pointer transition-colors",
                  isSpeaking && !isPaused ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
                aria-label="Read Table"
              >
                {isSpeaking && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              {isSpeaking && (
                <button
                  onClick={stopVoice}
                  className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  aria-label="Stop Voice"
                >
                  <Stop className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Fullscreen className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Display Content */}
        <div className="space-y-6 max-w-md mx-auto">
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Table of {num}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 print:hidden">
              Displaying steps 1 to 20. Active voice lines are highlighted.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-border/40 border border-border/60 rounded-2xl bg-secondary/10 print:bg-transparent overflow-hidden">
            {Array.from({ length: 20 }, (_, idx) => {
              const multiplier = idx + 1;
              const product = num * multiplier;
              const isActiveLine = voiceLine === multiplier;

              return (
                <div
                  key={multiplier}
                  className={cn(
                    "flex items-center justify-between px-6 py-3 font-mono text-sm md:text-base transition-colors",
                    isActiveLine 
                      ? "bg-primary/10 border-l-4 border-l-primary font-bold text-primary dark:text-primary-foreground"
                      : "hover:bg-secondary/40"
                  )}
                >
                  <div className="flex gap-1.5 items-center">
                    <span className="w-8 text-right text-muted-foreground">{num}</span>
                    <span className="text-muted-foreground">×</span>
                    <span className="w-6 text-left">{multiplier}</span>
                  </div>
                  <div className="text-muted-foreground">=</div>
                  <div className="w-16 text-right font-extrabold text-foreground">{product}</div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Bookmark quick list indicator */}
      {bookmarks.length > 0 && (
        <div className="bg-card p-4 rounded-xl border border-border/40 backdrop-blur-sm print:hidden">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <BookmarkCheck className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            Bookmarked Tables
          </h3>
          <div className="flex flex-wrap gap-2">
            {bookmarks.map((b) => (
              <button
                key={b}
                onClick={() => setNum(b)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-colors",
                  num === b 
                    ? "bg-primary text-primary-foreground border-transparent shadow-sm"
                    : "bg-secondary hover:bg-secondary/80 text-foreground border-border"
                )}
              >
                Table {b}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
