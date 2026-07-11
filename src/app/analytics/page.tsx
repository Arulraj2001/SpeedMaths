"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Trophy, Flame, Award, Clock, ArrowDownToLine, ArrowUpToLine, 
  Trash2, HelpCircle, Activity
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { 
  loadUserStats, resetStats, exportStats, importStats, 
  calculateUserLevel, BADGE_DEFINITIONS, UserStats
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(() => {
    if (typeof window !== "undefined") {
      return loadUserStats();
    }
    return null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync mount and client stats to avoid SSR hydration mismatches
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !stats) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto" />
        <p className="text-sm text-muted-foreground font-semibold">Aligning mathematical analytics...</p>
      </div>
    );
  }

  const records = stats.sessionRecords;

  // 1. General Totals
  const totalCorrect = records.reduce((acc, r) => acc + r.correct, 0);
  const totalWrong = records.reduce((acc, r) => acc + r.wrong, 0);
  const totalQuestions = totalCorrect + totalWrong;
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalMinutes = Math.round(stats.totalPracticeTime / 60);

  // Average speed over all sessions
  const overallSpeed = records.length > 0
    ? (records.reduce((acc, r) => acc + r.avgSpeed, 0) / records.length).toFixed(1)
    : "0.0";

  // Level Up parameters
  const { level, currentLevelXp, nextLevelXp, percentToNext } = calculateUserLevel(stats.totalXp);

  // 2. Heatmap generation (last 365 days / 53 weeks)
  const getHeatmapData = () => {
    const today = new Date();
    const cells = [];
    const dateMap = new Map<string, number>(); // dateStr -> minutes

    // Sum practice durations per day
    records.forEach((r) => {
      const current = dateMap.get(r.date) || 0;
      dateMap.set(r.date, current + (r.duration / 60));
    });

    // Generate last 365 calendar days starting from the Sunday of 52 weeks ago
    const startOffset = today.getDay(); // 0 is Sun, 6 is Sat
    const totalDays = 364 + startOffset; 
    const startDate = new Date();
    startDate.setDate(today.getDate() - totalDays);

    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];
      const minutesPrac = dateMap.get(dateStr) || 0;
      cells.push({
        date: dateStr,
        minutes: minutesPrac,
        dayOfWeek: currentDate.getDay(),
      });
    }

    return cells;
  };

  const heatmapCells = getHeatmapData();

  // Helper to color heatmap grids
  const getHeatmapColor = (minutes: number) => {
    if (minutes === 0) return "bg-secondary/40 border border-border/10";
    if (minutes < 1) return "bg-primary/20 hover:ring-1 hover:ring-primary";
    if (minutes < 3) return "bg-primary/45 hover:ring-1 hover:ring-primary";
    if (minutes < 7) return "bg-primary/75 hover:ring-1 hover:ring-primary";
    return "bg-primary hover:ring-2 hover:ring-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]";
  };

  // 3. SVG Line Chart: XP Progression last 7 Active Days
  const getLineChartData = () => {
    const dayMap = new Map<string, number>();
    
    // Sort records and sum XP
    records.forEach((r) => {
      const current = dayMap.get(r.date) || 0;
      dayMap.set(r.date, current + r.xpEarned);
    });

    const dates = Array.from(dayMap.keys()).sort();
    const lastDates = dates.slice(-7); // Keep last 7 days of activity
    
    if (lastDates.length === 0) {
      return { labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], points: [0, 0, 0, 0, 0, 0, 0] };
    }

    const labels = lastDates.map((d) => d.slice(5)); // MM-DD
    const points = lastDates.map((d) => dayMap.get(d) || 0);
    return { labels, points };
  };

  const lineChartData = getLineChartData();

  // 4. SVG Bar Chart: Practice Count per Category Topic
  const getBarChartData = () => {
    const topicCounts = new Map<string, number>();
    records.forEach((r) => {
      const current = topicCounts.get(r.topic) || 0;
      topicCounts.set(r.topic, current + 1);
    });

    const list = Array.from(topicCounts.entries()).map(([topic, count]) => ({
      label: topic.charAt(0).toUpperCase() + topic.slice(1, 6),
      count,
    }));

    // Pad with empty defaults if empty
    while (list.length < 5) {
      list.push({ label: "None", count: 0 });
    }
    return list.slice(0, 7); // Show top 7 topics
  };

  const barChartData = getBarChartData();

  // 5. SVG Radar Chart: Category Accuracy Breakdowns (Topic Mastery)
  const getRadarChartData = () => {
    // Topic keys to map on the radar axis
    const axes = [
      { key: "tables", name: "Tables" },
      { key: "squares", name: "Squares" },
      { key: "cubes", name: "Cubes" },
      { key: "fractions", name: "Frac" },
      { key: "powers", name: "Powers" },
      { key: "addition", name: "Sum" },
      { key: "subtraction", name: "Sub" },
      { key: "multiplication", name: "Mul" },
    ];

    const scores = axes.map((ax) => {
      const topicRecords = records.filter((r) => r.topic === ax.key);
      if (topicRecords.length === 0) return 0.2; // base score if un-practiced
      const correct = topicRecords.reduce((acc, r) => acc + r.correct, 0);
      const total = topicRecords.reduce((acc, r) => acc + r.correct + r.wrong, 0);
      return total > 0 ? Math.max(0.2, correct / total) : 0.2;
    });

    return { axes, scores };
  };

  const radarData = getRadarChartData();

  // 6. Strong / Weak Categories
  const getStrongAndWeakTopics = () => {
    const topicStats = new Map<string, { correct: number; total: number }>();
    records.forEach((r) => {
      const stats = topicStats.get(r.topic) || { correct: 0, total: 0 };
      stats.correct += r.correct;
      stats.total += r.correct + r.wrong;
      topicStats.set(r.topic, stats);
    });

    const list = Array.from(topicStats.entries())
      .map(([topic, stats]) => ({
        topic,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      }))
      .sort((a, b) => b.accuracy - a.accuracy);

    const strong = list.filter((l) => l.accuracy >= 70).slice(0, 2).map((l) => l.topic);
    const weak = list.filter((l) => l.accuracy < 70).slice(-2).map((l) => l.topic);

    return {
      strong: strong.length > 0 ? strong.join(", ") : "Practice more to calibrate",
      weak: weak.length > 0 ? weak.join(", ") : "None! High recall maintained",
    };
  };

  const { strong: strongTopics, weak: weakTopics } = getStrongAndWeakTopics();

  // Data Actions
  const handleExport = () => {
    const dataStr = exportStats();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'speedmaths_analytics_backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast("Backup JSON file exported successfully.", "success");
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      const fileContent = event.target?.result as string;
      const success = importStats(fileContent);
      if (success) {
        setStats(loadUserStats());
        toast("Backup analytics imported and synchronized successfully!", "success");
      } else {
        toast("Failed to import backup. Please check that the file format is a valid SpeedMaths JSON backup.", "error");
      }
    };
    fileReader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to delete all practice history, unlocked achievements, and levels? This cannot be undone.")) {
      const empty = resetStats();
      setStats(empty);
      toast("Analytics database reset successfully.", "info");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* XP Header Level progress card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User level progress ring */}
        <Card className="lg:col-span-2 glassmorphism border-border/40 p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-3 text-center md:text-left flex-grow">
            <Badge variant="outline" className="border-primary/20 text-primary uppercase font-bold text-[10px] tracking-wider px-2 py-0.5">
              Rank Profile
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight">Level {level} Math Wizard</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Level up by completing workout drills. Earn XP multipliers by maintaining correct streaks.
            </p>
            
            {/* Progress bar parameters */}
            <div className="pt-2 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground font-mono">
                <span>{currentLevelXp} / {nextLevelXp} XP</span>
                <span>{percentToNext}% to Next Level</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-secondary/80 border border-border/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-500" 
                  style={{ width: `${percentToNext}%` }}
                />
              </div>
            </div>
          </div>

          {/* Large glowing rating badge */}
          <div className="relative flex-shrink-0 h-28 w-28 flex items-center justify-center bg-gradient-to-tr from-primary/10 to-violet-500/10 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)]">
            <Trophy className="h-10 w-10 text-primary animate-pulse" />
            <div className="absolute bottom-1 right-1 bg-primary text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded border border-border/30">
              XP {stats.totalXp}
            </div>
          </div>
        </Card>

        {/* Streaks and highlights summary */}
        <Card className="glassmorphism border-border/40 p-6 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border/20">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Streaks & Logs</span>
            <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Longest Streak</span>
              <span className="block text-2xl font-extrabold text-foreground font-mono">🔥 {stats.longestStreak} days</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Streak</span>
              <span className="block text-2xl font-extrabold text-primary font-mono">🔥 {stats.currentStreak} days</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border/10 text-xs text-muted-foreground font-semibold flex justify-between items-center">
            <span>Last practiced date:</span>
            <span className="font-mono text-foreground">{stats.lastPracticeDate || "Not practiced yet"}</span>
          </div>
        </Card>
      </div>

      {/* Primary Dashboard Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 border-border bg-card/60">
          <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Solved Correct</span>
          <span className="text-2xl font-extrabold text-foreground font-mono">{totalCorrect}</span>
        </Card>
        <Card className="p-4 border-border bg-card/60">
          <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Solved Incorrect</span>
          <span className="text-2xl font-extrabold text-foreground font-mono">{totalWrong}</span>
        </Card>
        <Card className="p-4 border-border bg-card/60">
          <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Recall Accuracy</span>
          <span className={cn(
            "text-2xl font-extrabold font-mono",
            overallAccuracy >= 85 ? "text-emerald-500" : overallAccuracy >= 60 ? "text-amber-500" : "text-foreground"
          )}>{overallAccuracy}%</span>
        </Card>
        <Card className="p-4 border-border bg-card/60">
          <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Time Spent</span>
          <span className="text-2xl font-extrabold text-foreground font-mono">{totalMinutes} min</span>
        </Card>
        <Card className="p-4 border-border bg-card/60">
          <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Avg Speed</span>
          <span className="text-2xl font-extrabold text-foreground font-mono">{overallSpeed}s</span>
        </Card>
      </div>

      {/* SVG Charts Area grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SVG Line Chart: XP Progression */}
        <Card className="glassmorphism border-border/40 p-5 space-y-4">
          <CardHeader className="p-0 pb-2 border-b border-border/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold">Active XP Progression</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">XP points earned per active date.</CardDescription>
            </div>
            <Activity className="h-4.5 w-4.5 text-primary" />
          </CardHeader>
          <CardContent className="p-0 pt-4 flex items-center justify-center">
            {records.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-xs text-muted-foreground italic font-semibold">
                No logs recorded yet. Complete your first workout!
              </div>
            ) : (
              <div className="w-full">
                {/* SVG Chart */}
                <svg viewBox="0 0 500 240" className="w-full h-56 font-mono text-[9px] text-muted-foreground select-none">
                  {/* Gradients definition */}
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(99,102,241,0.25)" />
                      <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="40" y1="40" x2="480" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                  <line x1="40" y1="160" x2="480" y2="160" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                  <line x1="40" y1="200" x2="480" y2="200" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

                  {/* Construct path */}
                  {(() => {
                    const maxVal = Math.max(...lineChartData.points, 100);
                    const mapY = (val: number) => 200 - (val / maxVal) * 150;
                    const mapX = (idx: number) => 40 + idx * 70;
                    
                    const pathStr = `M 40,${mapY(lineChartData.points[0])} ` + lineChartData.points.map((p, i) => `L ${mapX(i)},${mapY(p)}`).join(" ");
                    const fillPathStr = `${pathStr} L ${mapX(lineChartData.points.length - 1)},200 L 40,200 Z`;

                    return (
                      <>
                        {/* Shaded Area fill */}
                        <path d={fillPathStr} fill="url(#lineGrad)" />
                        {/* Smooth Line */}
                        <path d={pathStr} fill="none" stroke="#6366f1" strokeWidth="3" />
                        
                        {/* Plot Circles */}
                        {lineChartData.points.map((p, i) => (
                          <g key={i}>
                            <circle cx={mapX(i)} cy={mapY(p)} r="4" className="fill-primary stroke-background" strokeWidth="1.5" />
                            <text x={mapX(i)} y={mapY(p) - 10} textAnchor="middle" className="font-bold fill-foreground">{p}</text>
                            <text x={mapX(i)} y="215" textAnchor="middle" className="fill-muted-foreground font-sans">{lineChartData.labels[i]}</text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SVG Bar Chart: Practice Count per Topic */}
        <Card className="glassmorphism border-border/40 p-5 space-y-4">
          <CardHeader className="p-0 pb-2 border-b border-border/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold">Workout Topic Frequencies</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Frequency of completed sessions per category.</CardDescription>
            </div>
            <Clock className="h-4.5 w-4.5 text-primary" />
          </CardHeader>
          <CardContent className="p-0 pt-4 flex items-center justify-center">
            {records.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-xs text-muted-foreground italic font-semibold">
                No logs recorded yet. Complete your first workout!
              </div>
            ) : (
              <div className="w-full">
                <svg viewBox="0 0 500 240" className="w-full h-56 font-mono text-[9px] text-muted-foreground select-none">
                  {/* Grid Lines */}
                  <line x1="40" y1="40" x2="480" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                  <line x1="40" y1="160" x2="480" y2="160" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                  <line x1="40" y1="200" x2="480" y2="200" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

                  {/* Draw Bars */}
                  {(() => {
                    const maxVal = Math.max(...barChartData.map((d) => d.count), 5);
                    const mapY = (val: number) => 200 - (val / maxVal) * 150;
                    const mapX = (idx: number) => 55 + idx * 60;

                    return barChartData.map((d, i) => (
                      <g key={i}>
                        {/* Animated rounded bars */}
                        <rect 
                          x={mapX(i)} 
                          y={mapY(d.count)} 
                          width="24" 
                          height={200 - mapY(d.count)} 
                          rx="4"
                          className="fill-primary/80 hover:fill-primary transition-all duration-300"
                        />
                        <text x={mapX(i) + 12} y={mapY(d.count) - 8} textAnchor="middle" className="font-bold fill-foreground">{d.count > 0 ? d.count : ""}</text>
                        <text x={mapX(i) + 12} y="215" textAnchor="middle" className="fill-muted-foreground font-sans">{d.label}</text>
                      </g>
                    ));
                  })()}
                </svg>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SVG Radar Chart: Category Mastery */}
        <Card className="glassmorphism border-border/40 p-5 space-y-4">
          <CardHeader className="p-0 pb-2 border-b border-border/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold">Calculations Strength Radar</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Accuracy mastery rates mapped per math category.</CardDescription>
            </div>
            <Award className="h-4.5 w-4.5 text-primary" />
          </CardHeader>
          <CardContent className="p-0 pt-4 flex items-center justify-center">
            {records.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-xs text-muted-foreground italic font-semibold">
                No logs recorded yet. Complete your first workout!
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <svg viewBox="0 0 320 320" className="w-80 h-80 font-mono text-[9px] text-muted-foreground select-none">
                  {(() => {
                    const cx = 160;
                    const cy = 160;
                    const r = 100;
                    const numAxes = radarData.axes.length;

                    // Compute grid ring polygons (25%, 50%, 75%, 100%)
                    const gridRings = [0.25, 0.5, 0.75, 1.0].map((scale) => {
                      const points = [];
                      for (let i = 0; i < numAxes; i++) {
                        const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                        const x = cx + r * scale * Math.cos(angle);
                        const y = cy + r * scale * Math.sin(angle);
                        points.push(`${x},${y}`);
                      }
                      return points.join(" ");
                    });

                    // Compute user metrics polygon
                    const strengthPoints = [];
                    for (let i = 0; i < numAxes; i++) {
                      const scale = radarData.scores[i]; // accuracy 0.2 to 1.0
                      const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                      const x = cx + r * scale * Math.cos(angle);
                      const y = cy + r * scale * Math.sin(angle);
                      strengthPoints.push(`${x},${y}`);
                    }
                    const strengthStr = strengthPoints.join(" ");

                    return (
                      <>
                        {/* Grid Polygons */}
                        {gridRings.map((points, idx) => (
                          <polygon 
                            key={idx} 
                            points={points} 
                            fill="none" 
                            stroke="currentColor" 
                            strokeOpacity="0.08" 
                            strokeWidth="1" 
                          />
                        ))}

                        {/* Axes lines & Labels */}
                        {radarData.axes.map((ax, i) => {
                          const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                          const x = cx + r * Math.cos(angle);
                          const y = cy + r * Math.sin(angle);
                          
                          const labelOffset = 18;
                          const lx = cx + (r + labelOffset) * Math.cos(angle);
                          const ly = cy + (r + labelOffset) * Math.sin(angle);
                          
                          let anchor: "start" | "end" | "middle" = "middle";
                          if (Math.cos(angle) > 0.1) anchor = "start";
                          else if (Math.cos(angle) < -0.1) anchor = "end";

                          return (
                            <g key={i}>
                              <line x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                              <text x={lx} y={ly + 3} textAnchor={anchor} className="font-bold fill-foreground font-sans">{ax.name}</text>
                            </g>
                          );
                        })}

                        {/* Outer 100% circle markers */}
                        <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity="0.04" />

                        {/* User Strength Polygon Fill */}
                        <polygon 
                          points={strengthStr} 
                          fill="rgba(99, 102, 241, 0.25)" 
                          stroke="#6366f1" 
                          strokeWidth="2.5" 
                        />
                        
                        {/* Strength circles */}
                        {strengthPoints.map((pt, i) => {
                          const [x, y] = pt.split(",").map(Number);
                          return (
                            <circle key={i} cx={x} cy={y} r="3" className="fill-primary stroke-background" strokeWidth="1" />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Breakdown: Strong vs Weak */}
        <Card className="glassmorphism border-border/40 p-5 space-y-6 flex flex-col justify-between">
          <CardHeader className="p-0 pb-2 border-b border-border/20">
            <CardTitle className="text-base font-extrabold">Cognitive Focus Matrix</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Category performance logs processed automatically.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0 space-y-5 flex-grow pt-4">
            
            <div className="space-y-2">
              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-widest">
                Strong Math Topics (Accuracy ≥ 70%)
              </span>
              <div className="p-3.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-sm font-semibold capitalize font-mono text-emerald-950 dark:text-emerald-300">
                {strongTopics}
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-[10px] text-rose-600 dark:text-rose-400 font-extrabold uppercase tracking-widest">
                Weak Math Topics (Accuracy &lt; 70%)
              </span>
              <div className="p-3.5 rounded-lg border border-rose-500/10 bg-rose-500/5 text-sm font-semibold capitalize font-mono text-rose-950 dark:text-rose-300">
                {weakTopics}
              </div>
            </div>

            <div className="p-3 bg-secondary/30 rounded-lg border border-border/40 text-xs text-muted-foreground space-y-1.5 leading-relaxed font-semibold">
              <div className="flex items-center gap-1.5 text-foreground font-bold">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                <span>Improving Performance</span>
              </div>
              <p>
                Math Wizard calculates level updates automatically based on correct replies. Launch target practice rounds in &quot;Hard&quot; difficulty or re-drill mistakes.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Heatmap Activity Calendar Grid */}
      <Card className="glassmorphism border-border/40 p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border/20">
          <div>
            <CardTitle className="text-base font-extrabold">Consistency Calendar</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Workout minutes logged across dates.</CardDescription>
          </div>
          <Activity className="h-5 w-5 text-primary" />
        </div>

        <div className="overflow-x-auto pt-2">
          {/* Scrollable Heatmap wrapper */}
          <div className="min-w-[640px] flex gap-1 justify-between select-none">
            {/* Split calendar cells into columns representing weeks */}
            {Array.from({ length: 53 }).map((_, colIdx) => {
              const weekCells = heatmapCells.slice(colIdx * 7, (colIdx + 1) * 7);
              return (
                <div key={colIdx} className="flex flex-col gap-1">
                  {weekCells.map((cell, idx) => (
                    <div
                      key={idx}
                      title={`${cell.date}: ${cell.minutes.toFixed(1)} min practiced`}
                      className={cn(
                        "h-2.5 w-2.5 rounded-sm transition-colors duration-300 cursor-pointer",
                        getHeatmapColor(cell.minutes)
                      )}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-end gap-2 items-center text-[10px] text-muted-foreground font-semibold">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded-sm bg-secondary/40 border border-border/10" />
          <div className="h-2.5 w-2.5 rounded-sm bg-primary/20" />
          <div className="h-2.5 w-2.5 rounded-sm bg-primary/45" />
          <div className="h-2.5 w-2.5 rounded-sm bg-primary/75" />
          <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </Card>

      {/* Badges Achievements panel */}
      <Card className="glassmorphism border-border/40 p-6 space-y-6">
        <div className="pb-2 border-b border-border/20">
          <CardTitle className="text-base font-extrabold">Achievements & Badges</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Gamified badge awards unlocked on completing performance criteria.</CardDescription>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = stats.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={cn(
                  "p-4 rounded-xl border flex flex-col justify-between items-center text-center space-y-3 transition-all",
                  isUnlocked
                    ? "border-primary/20 bg-primary/5 shadow-md shadow-primary/5"
                    : "border-border/30 bg-secondary/20 opacity-40"
                )}
              >
                <div className="text-4xl">{badge.icon}</div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-foreground">{badge.title}</h4>
                  <p className="text-[11px] text-muted-foreground font-semibold leading-snug">{badge.description}</p>
                </div>
                <Badge variant="outline" className={cn(
                  "text-[9px] uppercase font-bold tracking-wider px-2 py-0.5",
                  isUnlocked ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : "border-border/30 text-muted-foreground"
                )}>
                  {isUnlocked ? "Unlocked" : badge.criteria}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Import / Export manager console */}
      <Card className="glassmorphism border-border/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <CardTitle className="text-base font-extrabold">Data Management console</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Backup or restore your speed math statistics database.</CardDescription>
        </div>

        {/* Hidden inputs file upload */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept=".json" 
          onChange={handleFileImport} 
          className="hidden" 
        />

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="cursor-pointer"
            leftIcon={<ArrowDownToLine className="h-4 w-4" />}
          >
            Export Backup
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            className="cursor-pointer"
            leftIcon={<ArrowUpToLine className="h-4 w-4" />}
          >
            Import Backup
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-rose-500/20 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer"
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            Reset All
          </Button>
        </div>
      </Card>

    </div>
  );
}
