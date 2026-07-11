"use client";

import React, { useState } from "react";
import { 
  Search, Play, Printer, Bookmark, BookmarkCheck, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function CubesPage() {
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("speedmaths-cubes-bookmarks");
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
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const { toast } = useToast();

  const toggleBookmark = (n: number) => {
    let updated: number[];
    if (bookmarks.includes(n)) {
      updated = bookmarks.filter((b) => b !== n);
      toast(`Removed ${n}³ from Bookmarks.`, "info");
    } else {
      updated = [...bookmarks, n].sort((a, b) => a - b);
      toast(`Bookmarked ${n}³ = ${n * n * n}!`, "success");
    }
    setBookmarks(updated);
    localStorage.setItem("speedmaths-cubes-bookmarks", JSON.stringify(updated));
  };

  const handleVoice = (n: number) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPlayingId(n);

    const utterance = new SpeechSynthesisUtterance(`${n} cubed is ${n * n * n}`);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handlePrint = () => {
    window.print();
  };

  // Compile calculations list (1 to 50)
  const items = React.useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 50; i++) {
      arr.push({
        val: i,
        cube: i * i * i,
      });
    }
    return arr;
  }, []);

  // Filter items
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        String(item.val).includes(search) || 
        String(item.cube).includes(search);
      
      const matchesBookmark = !onlyBookmarks || bookmarks.includes(item.val);

      return matchesSearch && matchesBookmark;
    });
  }, [items, search, bookmarks, onlyBookmarks]);

  return (
    <div className="space-y-6">
      
      {/* Page Title details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Cubes (1-50)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Memorize power cubes up to 50. Filter using parameters below.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="h-4 w-4" />}
          >
            Print Grid
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border/40 backdrop-blur-sm print:hidden justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by number or cube value..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={cn(
              "h-11 px-4 text-xs font-semibold rounded-lg border cursor-pointer transition-all flex items-center gap-2",
              onlyBookmarks
                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                : "bg-secondary hover:bg-secondary/80 text-foreground border-border"
            )}
          >
            {onlyBookmarks ? (
              <>
                <BookmarkCheck className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>Showing Bookmarks Only</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Show Bookmarks Only</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Display Card List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/40 print:hidden">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">No cube computations match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 print:grid-cols-4 print:gap-6">
          {filteredItems.map((item) => {
            const isBookmarked = bookmarks.includes(item.val);
            const isPlaying = playingId === item.val;

            return (
              <Card
                key={item.val}
                className={cn(
                  "hover:border-primary/30 transition-all duration-300 relative group overflow-hidden bg-card/60 backdrop-blur-sm print:bg-white print:border print:border-black/10 print:shadow-none",
                  isBookmarked && "border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-500/2"
                )}
              >
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                  <span className="text-xs font-bold text-muted-foreground uppercase font-mono">
                    #{item.val}
                  </span>
                  
                  {/* Operations toolbar */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                    <button
                      onClick={() => handleVoice(item.val)}
                      className={cn(
                        "p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
                        isPlaying && "text-primary animate-pulse"
                      )}
                      title="Speak calculation"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => toggleBookmark(item.val)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Bookmark calculation"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Bookmark className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  {/* Keep bookmark visible if bookmarked and not hovered */}
                  {isBookmarked && (
                    <BookmarkCheck className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 absolute top-4 right-4 group-hover:hidden transition-all" />
                  )}
                </CardHeader>

                <CardContent className="p-4 pt-0 text-center space-y-1">
                  <div className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
                    {item.cube}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {item.val}³ = {item.cube}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}
