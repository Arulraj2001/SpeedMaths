"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Zap, Brain, Trophy, Volume2, VolumeX, HelpCircle, Settings,
  RotateCcw, ArrowRight, Check, X, ShieldAlert, Star, Clock, 
  ListRestart, Volume1, Volume, Monitor, Moon, Sun, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { topics } from "@/data/topics";
import { generateQuestionsSet, Question } from "@/lib/practice-generator";
import { playCorrectSound, playIncorrectSound, playTimeoutSound, toggleMute, isMuted, setVolumeState } from "@/lib/sound";
import { recordSession } from "@/lib/analytics";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ScreenState = "CONFIG" | "ENGINE" | "REVIEW";

interface ReviewItem {
  question: Question;
  userInput: string;
  isCorrect: boolean;
  timeTaken: number;
}

interface RecentHistoryItem {
  topicId: string;
  topicTitle: string;
  mode: string;
  difficulty: string;
  type?: string;
  count?: number;
  timer?: number;
  date: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export default function PracticePage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Config States (defaults for server-side render consistency)
  const [selectedTopic, setSelectedTopic] = useState<string>("tables");
  const [selectedMode, setSelectedMode] = useState<string>("practice");
  const [selectedType, setSelectedType] = useState<string>("mcq");
  const [selectedDiff, setSelectedDiff] = useState<string>("Medium");
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [selectedTimer, setSelectedTimer] = useState<number>(15);

  // Settings Modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState<number>(50); // Volume slider percentage
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  const [muted, setMuted] = useState(false);

  // Engine Active States
  const [screen, setScreen] = useState<ScreenState>("CONFIG");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>(" ");
  const [selectedMcq, setSelectedMcq] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false); // Flash Cards flip
  const [hintVisible, setHintVisible] = useState(false);

  // HUD Metrics
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);

  // Clocks
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [totalTimeLeft, setTotalTimeLeft] = useState<number>(60);
  const [avgSpeedAccumulator, setAvgSpeedAccumulator] = useState<number>(0);

  // Lists & Records
  const [reviewLogs, setReviewLogs] = useState<ReviewItem[]>([]);
  const [mistakesList, setMistakesList] = useState<Question[]>([]);
  const [globalMistakesCount, setGlobalMistakesCount] = useState<number>(0);
  const [recentHistory, setRecentHistory] = useState<RecentHistoryItem[]>([]);

  // PWA Install Prompt State
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const totalProgressBarRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 1. Initial client-side configuration and PWA loading
  useEffect(() => {
    // PWA beforeinstallprompt event tracker
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    // Sync sound synthesizer settings from context
    setSoundEnabled(!isMuted());
    setMuted(isMuted());

    // Load last configuration from localStorage
    const savedConfig = localStorage.getItem("speedmaths-last-config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.topic) setSelectedTopic(parsed.topic);
        if (parsed.mode) setSelectedMode(parsed.mode);
        if (parsed.type) setSelectedType(parsed.type);
        if (parsed.difficulty) setSelectedDiff(parsed.difficulty);
        if (parsed.count !== undefined) setSelectedCount(parseInt(parsed.count) || 10);
        if (parsed.timer !== undefined) setSelectedTimer(parsed.timer);
      } catch {}
    }

    // Load global mistakes count
    const savedMistakes = localStorage.getItem("speedmaths-global-mistakes");
    if (savedMistakes) {
      try {
        const parsed = JSON.parse(savedMistakes);
        setGlobalMistakesCount(parsed.length || 0);
      } catch {}
    }

    // Load recent history list
    const savedHistory = localStorage.getItem("speedmaths-workout-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setRecentHistory(parsed || []);
      } catch {}
    }

    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  // Sync animations class on html node
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (animationsEnabled) {
        root.classList.remove("speedmaths-no-animations");
      } else {
        root.classList.add("speedmaths-no-animations");
      }
    }
  }, [animationsEnabled]);

  // Sync volume state to audio synthesizer player
  useEffect(() => {
    setVolumeState(volume);
  }, [volume]);

  // 2. Active Game Loop Countdown Timer Effects
  useEffect(() => {
    if (screen !== "ENGINE") return;

    const startTimestamp = performance.now();
    let lastSecond = -1;
    let soundPlayed = false;

    const tick = (now: number) => {
      const elapsed = now - startTimestamp;

      if (selectedMode === "challenge") {
        const totalDuration = 60 * 1000;
        const remainingMs = Math.max(0, totalDuration - elapsed);
        const remainingSec = Math.ceil(remainingMs / 1000);

        // Update progress bar DOM directly
        if (totalProgressBarRef.current) {
          const percent = (remainingMs / totalDuration) * 100;
          totalProgressBarRef.current.style.width = `${percent}%`;
          if (percent < 20) {
            totalProgressBarRef.current.classList.add("bg-rose-500");
            totalProgressBarRef.current.classList.remove("bg-primary");
          } else {
            totalProgressBarRef.current.classList.add("bg-primary");
            totalProgressBarRef.current.classList.remove("bg-rose-500");
          }
        }

        // Only update React state on integer changes to avoid excessive renders
        if (remainingSec !== lastSecond) {
          lastSecond = remainingSec;
          setTotalTimeLeft(remainingSec);
          if (remainingSec === 5 && soundEnabled && !soundPlayed) {
            playTimeoutSound();
            soundPlayed = true;
          }
          if (remainingSec > 5) {
            soundPlayed = false;
          }
        }

        if (remainingMs <= 0) {
          handleSessionComplete();
          return;
        }
      } else if (selectedTimer > 0) {
        const limitMs = selectedTimer * 1000;
        const remainingMs = Math.max(0, limitMs - elapsed);
        const remainingSec = Math.ceil(remainingMs / 1000);

        // Update progress bar DOM directly
        if (progressBarRef.current) {
          const percent = (remainingMs / limitMs) * 100;
          progressBarRef.current.style.width = `${percent}%`;
          if (percent < 30) {
            progressBarRef.current.classList.add("bg-rose-500");
            progressBarRef.current.classList.remove("bg-primary");
          } else {
            progressBarRef.current.classList.add("bg-primary");
            progressBarRef.current.classList.remove("bg-rose-500");
          }
        }

        // Only update React state on integer changes
        if (remainingSec !== lastSecond) {
          lastSecond = remainingSec;
          setTimeLeft(remainingSec);
          if (remainingSec === 3 && soundEnabled && !soundPlayed) {
            playTimeoutSound();
            soundPlayed = true;
          }
          if (remainingSec > 3) {
            soundPlayed = false;
          }
        }

        if (remainingMs <= 0) {
          handleAnswer("", false, true); // Timeout
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, currentIndex, selectedMode, selectedTimer, soundEnabled]);

  // 3. KEYBOARD SHORTCUTS LOOP
  useEffect(() => {
    if (screen !== "ENGINE") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeQuestion = questions[currentIndex];
      if (!activeQuestion) return;

      // Escape to abort
      if (e.key === "Escape") {
        e.preventDefault();
        handleSessionComplete();
        toast("Session aborted.", "info");
        return;
      }

      // H to toggle hints
      if (e.key.toLowerCase() === "h") {
        e.preventDefault();
        setHintVisible((prev) => !prev);
        return;
      }

      // V to speak question text
      if (e.key.toLowerCase() === "v") {
        e.preventDefault();
        speakQuestion();
        return;
      }

      // MCQ mapping (Keys 1-4)
      if (selectedType === "mcq" && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        const optIndex = parseInt(e.key) - 1;
        const optionSelected = activeQuestion.options[optIndex];
        if (optionSelected) {
          setSelectedMcq(optionSelected);
          setTimeout(() => handleAnswer(optionSelected), 150);
        }
        return;
      }

      // True/False mapping (Key 1 for True, 2 for False)
      if (selectedType === "truefalse" && ["1", "2"].includes(e.key)) {
        e.preventDefault();
        const ansSelected = e.key === "1" ? "True" : "False";
        setSelectedMcq(ansSelected);
        setTimeout(() => handleAnswer(ansSelected), 150);
        return;
      }

      // Flash Cards (Space to flip, 1 for Wrong, 2 for Correct)
      if (selectedType === "flash") {
        if (e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
          return;
        }
        if (isFlipped && ["1", "2"].includes(e.key)) {
          e.preventDefault();
          const selfGrade = e.key === "2"; // 2 represents correct
          handleAnswer("", selfGrade);
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, currentIndex, selectedType, isFlipped, questions]);

  // Speech Reader Synthesis
  const speakQuestion = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) return;

    window.speechSynthesis.cancel(); // Stop active voices
    
    // Clean text representations for better speech (e.g. × to times, ² to squared)
    const speakText = activeQuestion.text
      .replace("×", "times")
      .replace("÷", "divided by")
      .replace("²", " squared")
      .replace("³", " cubed")
      .replace("^", " raised to ")
      .replace("?", "");

    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.rate = 1.0;
    utterance.volume = volume / 100;
    window.speechSynthesis.speak(utterance);
  };

  const handleMuteToggle = () => {
    const isNowMuted = toggleMute();
    setMuted(isNowMuted);
    setSoundEnabled(!isNowMuted);
    toast(isNowMuted ? "Sound muted." : "Sound unmuted.", "info");
  };

  const triggerPwaInstall = () => {
    if (!pwaInstallPrompt) return;
    pwaInstallPrompt.prompt();
    pwaInstallPrompt.userChoice.then((choice: { outcome: "accepted" | "dismissed" }) => {
      if (choice.outcome === "accepted") {
        toast("SpeedMaths installed successfully as a PWA!", "success");
        setPwaInstallPrompt(null);
      }
    });
  };

  // Launch Session
  function handleLaunch(
    drillType: "STANDARD" | "SESSION_MISTAKES" | "GLOBAL_MISTAKES" = "STANDARD",
    overrides?: {
      topic?: string;
      mode?: string;
      type?: string;
      difficulty?: string;
      count?: number;
      timer?: number;
    }
  ) {
    let questionSet: Question[] = [];

    // Sync state variables if overrides are supplied
    if (overrides) {
      if (overrides.topic !== undefined) setSelectedTopic(overrides.topic);
      if (overrides.mode !== undefined) setSelectedMode(overrides.mode);
      if (overrides.type !== undefined) setSelectedType(overrides.type);
      if (overrides.difficulty !== undefined) setSelectedDiff(overrides.difficulty);
      if (overrides.count !== undefined) setSelectedCount(overrides.count);
      if (overrides.timer !== undefined) setSelectedTimer(overrides.timer);
    }

    const activeTopic = overrides?.topic ?? selectedTopic;
    const activeMode = overrides?.mode ?? selectedMode;
    const activeType = overrides?.type ?? selectedType;
    const activeDiff = overrides?.difficulty ?? selectedDiff;
    const activeCount = overrides?.count ?? selectedCount;
    const activeTimer = overrides?.timer ?? selectedTimer;

    if (drillType === "GLOBAL_MISTAKES") {
      const saved = localStorage.getItem("speedmaths-global-mistakes");
      if (saved) {
        try {
          questionSet = JSON.parse(saved);
        } catch {
          // Ignore
        }
      }
      if (questionSet.length === 0) {
        toast("No cached mistakes found to practice.", "info");
        return;
      }
      toast(`Global Mistakes Drill: ${questionSet.length} questions loaded.`, "info");
    } else if (drillType === "SESSION_MISTAKES" && mistakesList.length > 0) {
      questionSet = [...mistakesList];
      toast(`Session Mistakes Drill: ${questionSet.length} questions.`, "info");
    } else {
      // Seeded random for Daily Challenge using Calendar Date
      if (activeMode === "daily") {
        setSelectedTopic("shuffle");
        setSelectedType("mcq");
        setSelectedDiff("Adaptive");
        setSelectedCount(20);
        setSelectedTimer(10);
        
        const seedStr = `daily-${new Date().toDateString()}`;
        questionSet = generateQuestionsSet("shuffle", "Adaptive", 20, seedStr);
        toast("Daily Challenge Loaded: Seeded using Calendar Date.", "success");
      } else {
        questionSet = generateQuestionsSet(
          activeTopic,
          activeDiff as "Easy" | "Medium" | "Hard" | "Adaptive" | "Random",
          activeCount
        );
      }

      // Save Last used configuration
      localStorage.setItem("speedmaths-last-config", JSON.stringify({
        topic: activeTopic,
        mode: activeMode,
        type: activeType,
        difficulty: activeDiff,
        count: activeCount,
        timer: activeTimer
      }));
    }

    setQuestions(questionSet);
    setCurrentIndex(0);
    setInputValue(" ");
    setSelectedMcq(null);
    setIsFlipped(false);
    setStreak(0);
    setMaxStreak(0);
    setScore(0);
    setXp(0);
    setAvgSpeedAccumulator(0);
    setReviewLogs([]);
    setHintVisible(false);

    const initialLives = (activeMode === "exam" || activeMode === "challenge" || activeMode === "daily") ? 3 : 999;
    setLives(initialLives);

    setTimeLeft(activeTimer);
    setTotalTimeLeft(60);

    setScreen("ENGINE");
    startTimeRef.current = Date.now();

    // Focus textbox
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 150);
  }

  function handleAnswer(answerText: string, isSelfGradedCorrect: boolean = false, isTimeout: boolean = false) {
    if (timerRef.current) clearInterval(timerRef.current);

    const activeQuestion = questions[currentIndex];
    const timeSpent = (Date.now() - startTimeRef.current) / 1000;
    setAvgSpeedAccumulator((prev) => prev + timeSpent);

    let isCorrect = false;

    if (isTimeout) {
      isCorrect = false;
    } else if (selectedType === "flash") {
      isCorrect = isSelfGradedCorrect;
    } else {
      isCorrect = answerText.trim().toLowerCase() === activeQuestion.answer.trim().toLowerCase();
    }

    // Sounds
    if (soundEnabled) {
      if (isCorrect) playCorrectSound();
      else playIncorrectSound();
    }

    let scoreGained = 0;
    let xpGained = 0;

    if (isCorrect) {
      const activeStreak = streak + 1;
      setStreak(activeStreak);
      if (activeStreak > maxStreak) setMaxStreak(activeStreak);

      const multiplier = activeStreak >= 10 ? 3 : activeStreak >= 5 ? 2 : 1;
      scoreGained = 10 * multiplier;
      xpGained = 5 * multiplier;

      if (selectedMode === "daily") xpGained *= 2;

      setScore((prev) => prev + scoreGained);
      setXp((prev) => prev + xpGained);
      
      // If practicing global mistakes, remove from list if resolved!
      if (selectedTopic === "global-mistakes") {
        removeGlobalMistake(activeQuestion.id);
      }
    } else {
      setStreak(0);
      if (lives < 99) {
        setLives((prev) => {
          const nextVal = prev - 1;
          if (nextVal <= 0) {
            setTimeout(() => handleSessionComplete(true), 100);
          }
          return nextVal;
        });
      }

      // Add to global mistakes list for future practice sessions
      saveGlobalMistake(activeQuestion);
    }

    setReviewLogs((prev) => [
      ...prev,
      {
        question: activeQuestion,
        userInput: isTimeout ? "[Timeout]" : answerText,
        isCorrect,
        timeTaken: timeSpent,
      },
    ]);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length || (selectedCount <= 0 && nextIndex >= 100)) {
      setTimeout(() => handleSessionComplete(), 200);
    } else {
      setCurrentIndex(nextIndex);
      setInputValue(" ");
      setSelectedMcq(null);
      setIsFlipped(false);
      setHintVisible(false);
      startTimeRef.current = Date.now();
      
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }

  function handleSessionComplete(failed: boolean = false) {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen("REVIEW");

    if (!failed && selectedMode !== "infinite") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Save analytics
    if (reviewLogs.length > 0) {
      const correctCount = reviewLogs.filter((l) => l.isCorrect).length;
      const wrongCount = reviewLogs.length - correctCount;
      const avgSpeedVal = avgSpeedAccumulator / reviewLogs.length;

      const { newlyUnlockedBadges } = recordSession({
        topic: selectedTopic,
        difficulty: selectedDiff,
        correct: correctCount,
        wrong: wrongCount,
        xpEarned: xp,
        avgSpeed: parseFloat(avgSpeedVal.toFixed(2)) || 0,
        duration: Math.round(avgSpeedAccumulator) || 0,
        maxStreak: maxStreak,
      });

      if (newlyUnlockedBadges.length > 0) {
        newlyUnlockedBadges.forEach((badgeId) => {
          setTimeout(() => {
            toast(`Achievement Unlocked! 🏆 Badge: ${badgeId.toUpperCase().replace("-", " ")}`, "success");
          }, 800);
        });
      }

      // Add to workout history log
      const title = selectedTopic === "shuffle" ? "Shuffle All" : topics.find((t) => t.id === selectedTopic)?.title || selectedTopic;
      const historyItem: RecentHistoryItem = {
        topicId: selectedTopic,
        topicTitle: title,
        mode: selectedMode,
        difficulty: selectedDiff,
        type: selectedType,
        count: selectedCount,
        timer: selectedTimer,
        date: new Date().toLocaleDateString(),
      };
      
      const updatedHistory = [historyItem, ...recentHistory.slice(0, 4)];
      setRecentHistory(updatedHistory);
      localStorage.setItem("speedmaths-workout-history", JSON.stringify(updatedHistory));
    }

    const failedQuestions = reviewLogs
      .filter((log) => !log.isCorrect)
      .map((log) => log.question);
    setMistakesList(failedQuestions);
  }

  // 4. Global mistakes caching updates
  const saveGlobalMistake = (q: Question) => {
    let list: Question[] = [];
    const saved = localStorage.getItem("speedmaths-global-mistakes");
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch {
        // Ignore
      }
    }
    // Prevent duplicates
    if (!list.some((existing) => existing.text === q.text)) {
      list.push(q);
      localStorage.setItem("speedmaths-global-mistakes", JSON.stringify(list));
      setGlobalMistakesCount(list.length);
    }
  };

  const removeGlobalMistake = (id: string) => {
    let list: Question[] = [];
    const saved = localStorage.getItem("speedmaths-global-mistakes");
    if (saved) {
      try {
        list = JSON.parse(saved);
        const filtered = list.filter((q) => q.id !== id);
        localStorage.setItem("speedmaths-global-mistakes", JSON.stringify(filtered));
        setGlobalMistakesCount(filtered.length);
      } catch {
        // Ignore
      }
    }
  };

  const statsSummary = React.useMemo(() => {
    if (reviewLogs.length === 0) return { accuracy: 0, avgSpeed: 0, stars: 0 };
    const correctCount = reviewLogs.filter((l) => l.isCorrect).length;
    const accuracy = Math.round((correctCount / reviewLogs.length) * 100);
    const avgSpeed = (avgSpeedAccumulator / reviewLogs.length).toFixed(1);
    
    let stars = 0;
    if (accuracy >= 95) stars = 3;
    else if (accuracy >= 75) stars = 2;
    else if (accuracy >= 50) stars = 1;

    return { accuracy, avgSpeed, stars };
  }, [reviewLogs, avgSpeedAccumulator]);

  const transitions = animationsEnabled ? { duration: 0.15 } : { duration: 0 };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. CONFIGURATION VIEW */}
      {screen === "CONFIG" && (
        <div className="space-y-6">
          <Card className="glassmorphism border-border/40">
            <CardHeader className="text-center space-y-2 border-b border-border/30 pb-6 relative">
              
              {/* Settings button top-right */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="absolute top-4 right-4 h-10 w-10 border border-border/80 bg-secondary/30 hover:bg-secondary rounded-lg flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                title="System Settings"
              >
                <Settings className="h-5 w-5" />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Arithmetic Cockpit
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground max-w-sm mx-auto">
                Configure workouts, streaks, sound synthesis, and launch mental challenges.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-8">
              
              {/* Setup options fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Topic</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                    <option value="shuffle">🌪️ Shuffle All</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Practice Mode</label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="practice">🎯 Standard Practice</option>
                    <option value="exam">🏆 Exam Mode (Strict 3 Lives)</option>
                    <option value="challenge">⚡ Time Attack (60s total)</option>
                    <option value="infinite">♾️ Infinite Mode (Indefinite)</option>
                    <option value="daily">📅 Seeded Daily Challenge</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    disabled={selectedMode === "daily"}
                  >
                    <option value="manual">⌨️ Manual Number Input</option>
                    <option value="mcq">🎛️ Multiple Choice (MCQ)</option>
                    <option value="truefalse">⚖️ True / False</option>
                    <option value="flash">🃏 Flash Cards (Self Graded)</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Difficulty Scale</label>
                  <select
                    value={selectedDiff}
                    onChange={(e) => setSelectedDiff(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    disabled={selectedMode === "daily"}
                  >
                    <option value="Easy">🟢 Easy</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Hard">🔴 Hard</option>
                    <option value="Adaptive">📈 Adaptive Progression</option>
                    <option value="Random">🔀 Random Mix</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question Count</label>
                  <select
                    value={selectedCount}
                    onChange={(e) => setSelectedCount(parseInt(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    disabled={selectedMode === "daily" || selectedMode === "infinite"}
                  >
                    <option value={10}>10 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                    <option value={50}>50 Questions</option>
                    <option value={100}>100 Questions</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time Limit Per Question</label>
                  <select
                    value={selectedTimer}
                    onChange={(e) => setSelectedTimer(parseInt(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    disabled={selectedMode === "daily" || selectedMode === "challenge"}
                  >
                    <option value={3}>3 Seconds (Expert)</option>
                    <option value={5}>5 Seconds</option>
                    <option value={10}>10 Seconds</option>
                    <option value={15}>15 Seconds</option>
                    <option value={20}>20 Seconds</option>
                    <option value={30}>30 Seconds</option>
                    <option value={60}>60 Seconds</option>
                    <option value={0}>∞ Unlimited Time</option>
                  </select>
                </div>

              </div>

              {/* Data actions footer */}
              <div className="pt-6 border-t border-border/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Global Mistakes Practice trigger */}
                {globalMistakesCount > 0 ? (
                  <button
                    onClick={() => handleLaunch("GLOBAL_MISTAKES")}
                    className="flex h-11 px-4 text-xs font-bold rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer items-center gap-2 transition-all w-full sm:w-auto justify-center"
                  >
                    <ShieldAlert className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                    <span>Practice Cached Mistakes ({globalMistakesCount})</span>
                  </button>
                ) : (
                  <div className="text-xs text-muted-foreground font-semibold">Zero cached errors in memory.</div>
                )}

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="premium"
                    size="md"
                    onClick={() => handleLaunch("STANDARD")}
                    className="flex-1 sm:flex-initial px-10 cursor-pointer"
                    rightIcon={<ArrowRight className="h-4.5 w-4.5" />}
                  >
                    Launch Workout
                  </Button>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Quick history launchers */}
          {recentHistory.length > 0 && (
            <Card className="border-border bg-card/60 p-4 space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent workout history
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {recentHistory.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      const overrides = {
                        topic: item.topicId,
                        mode: item.mode,
                        difficulty: item.difficulty,
                        type: item.type || selectedType,
                        count: item.count || selectedCount,
                        timer: item.timer !== undefined ? item.timer : selectedTimer,
                      };
                      
                      setSelectedTopic(overrides.topic);
                      setSelectedMode(overrides.mode);
                      setSelectedDiff(overrides.difficulty);
                      setSelectedType(overrides.type);
                      setSelectedCount(overrides.count);
                      setSelectedTimer(overrides.timer);
                      
                      handleLaunch("STANDARD", overrides);
                    }}
                    className="p-3 border border-border/50 rounded-lg bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <span className="block font-bold text-foreground capitalize truncate max-w-[120px]">{item.topicTitle}</span>
                      <span className="block text-[10px] text-muted-foreground font-semibold uppercase">{item.difficulty} • {item.mode}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* PWA Install Promo bar */}
          {pwaInstallPrompt && (
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-4">
              <div className="space-y-1 text-xs md:text-sm">
                <span className="block font-bold text-foreground">SpeedMaths Desktop Application</span>
                <span className="block text-xs text-muted-foreground font-medium">Install locally to practice calculation sets offline with complete speeds.</span>
              </div>
              <Button
                variant="premium"
                size="sm"
                onClick={triggerPwaInstall}
                className="cursor-pointer"
              >
                Install App
              </Button>
            </div>
          )}

        </div>
      )}

      {/* 2. GAME HUD ACTIVE DECK */}
      {screen === "ENGINE" && questions.length > 0 && (
        <div className="space-y-6">
          
          {/* Active HUD Header */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border/40 backdrop-blur-sm">
            
            <div className="text-center font-mono">
              <span className="block text-[10px] text-muted-foreground uppercase font-sans font-bold">Progress</span>
              <span className="text-base font-extrabold text-foreground">
                {selectedMode === "infinite" ? `Q# ${currentIndex + 1}` : `${currentIndex + 1} / ${questions.length}`}
              </span>
            </div>

            <div className="text-center flex flex-col items-center">
              <span className="block text-[10px] text-muted-foreground uppercase font-sans font-bold">Streak</span>
              <div className="flex items-center gap-1">
                <span className="text-base font-extrabold text-foreground">{streak}</span>
                {streak >= 5 && <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />}
              </div>
            </div>

            <div className="text-center">
              <span className="block text-[10px] text-muted-foreground uppercase font-sans font-bold">Score</span>
              <span className="text-base font-extrabold text-foreground font-mono">{score} pts</span>
            </div>

            <div className="text-center">
              <span className="block text-[10px] text-muted-foreground uppercase font-sans font-bold">Hearts</span>
              <div className="flex items-center justify-center gap-1 text-rose-500">
                {lives > 5 ? (
                  <span className="text-xs font-semibold text-muted-foreground font-mono font-bold">∞ Relaxed</span>
                ) : (
                  Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                    <span key={i} className="text-lg">❤️</span>
                  ))
                )}
              </div>
            </div>

            {/* Read out Voice trigger */}
            <div className="text-center">
              <button
                onClick={speakQuestion}
                className="mx-auto h-9 w-9 border border-border/50 bg-secondary/30 hover:bg-secondary rounded-lg flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-all"
                title="Speak Question aloud (V)"
              >
                <Volume1 className="h-4.5 w-4.5 text-primary" />
              </button>
            </div>

            <div className="col-span-3 sm:col-span-1 text-center py-2 sm:py-0 border-t sm:border-t-0 sm:border-l border-border/40 flex items-center justify-center gap-2">
              <Clock className="h-4.5 w-4.5 text-muted-foreground" />
              {selectedMode === "challenge" ? (
                <span className={cn("font-mono text-base font-bold", totalTimeLeft < 10 ? "text-rose-500 animate-pulse" : "text-foreground")}>
                  {totalTimeLeft}s
                </span>
              ) : selectedTimer > 0 ? (
                <span className={cn("font-mono text-base font-bold", timeLeft < 4 ? "text-rose-500 animate-pulse" : "text-foreground")}>
                  {timeLeft}s
                </span>
              ) : (
                <span className="text-xs text-muted-foreground font-mono font-bold">No Timer</span>
              )}
            </div>

          </div>

          {/* Question Box Card */}
          <Card className="glassmorphism border-border/40 overflow-hidden relative min-h-[300px] flex flex-col justify-between">
            {/* Smooth Visual Timer Progress Bar */}
            {selectedMode === "challenge" ? (
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary/30 z-20">
                <div
                  ref={totalProgressBarRef}
                  className="h-full bg-primary transition-all duration-75 ease-linear"
                  style={{ width: "100%" }}
                />
              </div>
            ) : selectedTimer > 0 ? (
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary/30 z-20">
                <div
                  ref={progressBarRef}
                  className="h-full bg-primary transition-all duration-75 ease-linear"
                  style={{ width: "100%" }}
                />
              </div>
            ) : null}
            <CardHeader className="pb-2 border-b border-border/10">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Calculations Speed-Deck</span>
                <span className="font-semibold uppercase tracking-wider text-primary">
                  {selectedTopic === "shuffle" ? "Mixed Shuffle" : selectedTopic.replace("-", " ")}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 flex-grow flex flex-col justify-center items-center space-y-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={transitions}
                  className="text-center w-full space-y-8"
                >
                  
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-mono select-none">
                    {questions[currentIndex].text}
                  </h2>

                  <div className="w-full max-w-md mx-auto pt-4">
                    
                    {/* MCQ Choices */}
                    {selectedType === "mcq" && (
                      <div className="grid grid-cols-2 gap-4">
                        {questions[currentIndex].options.map((opt, idx) => (
                          <Button
                            key={opt}
                            variant={selectedMcq === opt ? "default" : "outline"}
                            className="h-14 font-mono text-lg font-bold border-border/80 cursor-pointer hover:bg-secondary relative"
                            onClick={() => {
                              setSelectedMcq(opt);
                              setTimeout(() => handleAnswer(opt), 150);
                            }}
                          >
                            <span className="absolute top-1 left-1.5 font-sans font-semibold text-[9px] text-muted-foreground">
                              {idx + 1}
                            </span>
                            {opt}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* True/False Choices */}
                    {selectedType === "truefalse" && (
                      <div className="grid grid-cols-2 gap-6">
                        {["True", "False"].map((opt, idx) => (
                          <Button
                            key={opt}
                            variant={selectedMcq === opt ? "default" : "outline"}
                            className={cn(
                              "h-16 text-lg font-extrabold cursor-pointer hover:bg-secondary relative",
                              opt === "True" ? "border-emerald-500/20 hover:text-emerald-500" : "border-rose-500/20 hover:text-rose-500"
                            )}
                            onClick={() => {
                              setSelectedMcq(opt);
                              setTimeout(() => handleAnswer(opt), 150);
                            }}
                          >
                            <span className="absolute top-1 left-1.5 font-sans font-semibold text-[9px] text-muted-foreground">
                              {idx + 1}
                            </span>
                            {opt}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Manual inputs typing */}
                    {selectedType === "manual" && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAnswer(inputValue);
                        }}
                        className="flex gap-3"
                      >
                        <input
                          type="text"
                          ref={inputRef}
                          required
                          placeholder="Type answer..."
                          value={inputValue.trim()}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="flex-1 h-12 px-4 rounded-lg border border-border bg-background text-base font-mono font-bold text-center outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all animate-none"
                          autoFocus
                        />
                        <Button type="submit" variant="premium" className="h-12 px-6 cursor-pointer">Submit</Button>
                      </form>
                    )}

                    {/* Flash Cards Grads */}
                    {selectedType === "flash" && (
                      <div className="space-y-4">
                        <div 
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="h-32 border border-border border-dashed rounded-xl flex items-center justify-center bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-all select-none"
                        >
                          {isFlipped ? (
                            <div className="text-center">
                              <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Correct Answer</span>
                              <span className="text-3xl font-extrabold font-mono text-primary">{questions[currentIndex].answer}</span>
                              <span className="block text-[10px] text-muted-foreground font-semibold mt-2">Press 1 (Wrong) or 2 (Correct)</span>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-muted-foreground animate-pulse">Click or Press Space to Flip</span>
                          )}
                        </div>

                        {isFlipped && (
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant="outline"
                              className="h-12 border-rose-500/20 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold cursor-pointer relative"
                              onClick={() => handleAnswer("", false)}
                              leftIcon={<X className="h-4.5 w-4.5" />}
                            >
                              <span className="absolute top-1 left-1.5 font-sans font-semibold text-[9px] text-muted-foreground">1</span>
                              Wrong
                            </Button>
                            <Button
                              variant="outline"
                              className="h-12 border-emerald-500/20 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer relative"
                              onClick={() => handleAnswer("", true)}
                              leftIcon={<Check className="h-4.5 w-4.5" />}
                            >
                              <span className="absolute top-1 left-1.5 font-sans font-semibold text-[9px] text-muted-foreground">2</span>
                              Correct
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </motion.div>
              </AnimatePresence>

            </CardContent>

            <CardFooter className="pt-2 border-t border-border/10 flex flex-col space-y-2">
              <div className="w-full flex justify-between items-center text-xs text-muted-foreground select-none">
                <button
                  onClick={() => setHintVisible(!hintVisible)}
                  className="font-semibold hover:text-foreground cursor-pointer flex items-center gap-1 py-1"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{hintVisible ? "Hide Hint (H)" : "Reveal Hint (H)"}</span>
                </button>
                
                {/* Keyboard shortcut indices info */}
                <span className="font-mono text-[10px]">
                  {selectedType === "mcq" ? "[1]-[4] select" : selectedType === "flash" ? "[Space] flip • [1]/[2] score" : ""}
                </span>
              </div>
              
              {hintVisible && (
                <div className="w-full p-3 rounded-lg border border-border/80 bg-secondary/30 text-xs text-muted-foreground leading-relaxed">
                  {questions[currentIndex].hint}
                </div>
              )}
            </CardFooter>
          </Card>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
            <span>Seeded engine active.</span>
            <button
              onClick={() => handleSessionComplete(false)}
              className="hover:underline text-rose-500 font-bold cursor-pointer"
            >
              Abort Workout (Esc)
            </button>
          </div>

        </div>
      )}

      {/* 3. PERFORMANCE RESULTS SHEET */}
      {screen === "REVIEW" && (
        <Card className="glassmorphism border-border/40 space-y-8">
          <CardHeader className="text-center space-y-4 border-b border-border/30 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
              <Trophy className="h-6 w-6 text-white animate-bounce" />
            </div>
            
            <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Workout Summary
            </CardTitle>
            
            <div className="flex justify-center gap-1.5 text-yellow-500 text-2xl py-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-6 w-6",
                    i < statsSummary.stars ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground opacity-30"
                  )}
                />
              ))}
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              {statsSummary.stars === 3 ? "Perfect recall!" : statsSummary.stars === 2 ? "Great Accuracy" : statsSummary.stars === 1 ? "Passing drills" : "Practice needed"}
            </p>
          </CardHeader>

          <CardContent className="p-6 md:p-8 space-y-8">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl border border-border bg-secondary/20">
                <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Accuracy</span>
                <span className="text-2xl font-extrabold text-foreground">{statsSummary.accuracy}%</span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/20">
                <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">XP Earned</span>
                <span className="text-2xl font-extrabold text-primary">+{xp} XP</span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/20">
                <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Avg Speed</span>
                <span className="text-2xl font-extrabold text-foreground">{statsSummary.avgSpeed}s</span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/20">
                <span className="block text-[10px] text-muted-foreground uppercase font-bold mb-1">Max Streak</span>
                <span className="text-2xl font-extrabold text-foreground">🔥 {maxStreak}</span>
              </div>
            </div>

            {/* Re-drill session mistakes list prompt */}
            {mistakesList.length > 0 && (
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-center space-y-3">
                <div className="text-sm font-semibold text-rose-800 dark:text-rose-300 flex items-center justify-center gap-1.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                  <span>You failed {mistakesList.length} equations.</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLaunch("SESSION_MISTAKES")}
                  className="border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  leftIcon={<ListRestart className="h-4.5 w-4.5" />}
                >
                  Re-drill Mistakes Only
                </Button>
              </div>
            )}

            {/* List Review Logs */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Question Review Log
              </span>
              
              <div className="border border-border/60 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border text-muted-foreground font-semibold">
                      <th className="p-3">Question</th>
                      <th className="p-3">Your Answer</th>
                      <th className="p-3">Correct Answer</th>
                      <th className="p-3 text-right">Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {reviewLogs.map((log, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          log.isCorrect 
                            ? "bg-emerald-500/5 dark:bg-emerald-500/2 text-emerald-900 dark:text-emerald-300"
                            : "bg-rose-500/5 dark:bg-rose-500/2 text-rose-900 dark:text-rose-300"
                        )}
                      >
                        <td className="p-3 font-semibold text-foreground">{log.question.text}</td>
                        <td className="p-3 font-bold">{log.userInput}</td>
                        <td className="p-3 font-bold text-foreground">{log.question.answer}</td>
                        <td className="p-3 text-right font-sans text-muted-foreground">{log.timeTaken.toFixed(1)}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-6 border-t border-border/30 flex flex-wrap gap-4 justify-between">
              <Button
                variant="outline"
                onClick={() => setScreen("CONFIG")}
                className="cursor-pointer"
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Exit to Configurator
              </Button>
              <Button
                variant="premium"
                onClick={() => handleLaunch("STANDARD")}
                className="cursor-pointer"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Restart Same Setup
              </Button>
            </div>

          </CardContent>
        </Card>
      )}

      {/* 4. SYSTEM OPTIONS SETTINGS MODAL */}
      {isSettingsOpen && (
        <div
          onClick={() => setIsSettingsOpen(false)}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-border shadow-2xl relative bg-card cursor-default"
          >
            
            <CardHeader className="border-b border-border/20 pb-4 flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">System Configuration</CardTitle>
                <CardDescription className="text-xs">Adjust sound synthesizers, theme switches, and layout parameters.</CardDescription>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="h-8 w-8 hover:bg-secondary rounded-lg flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground transition-all flex-shrink-0 -mt-1 -mr-1"
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              
              {/* Sound & volume */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workout Audio Synthesizer</label>
                  <button
                    onClick={handleMuteToggle}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {muted ? "Unmute Audio" : "Mute Audio"}
                  </button>
                </div>
                <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg border border-border/40">
                  {volume === 0 || muted ? (
                    <VolumeX className="h-5 w-5 text-rose-500" />
                  ) : volume < 35 ? (
                    <Volume className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-primary" />
                  )}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={muted ? 0 : volume}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setVolume(val);
                      setVolumeState(val);
                      if (muted) handleMuteToggle();
                    }}
                    className="flex-1 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xs font-mono font-bold w-8 text-right">{muted ? 0 : volume}%</span>
                </div>
              </div>

              {/* Animations toggler */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Layout Motion Effects</label>
                <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-lg border border-border/40">
                  <span className="text-xs text-muted-foreground font-semibold">Enable slide transitions</span>
                  <button
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                    className={cn(
                      "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300",
                      animationsEnabled ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <div className={cn(
                      "bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300",
                      animationsEnabled ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>

              {/* Theme Settings Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Aesthetic Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "h-10 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                      theme === "light" ? "border-primary bg-primary/5 text-primary font-bold" : "border-border/80 hover:bg-secondary text-muted-foreground"
                    )}
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "h-10 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                      theme === "dark" ? "border-primary bg-primary/5 text-primary font-bold" : "border-border/80 hover:bg-secondary text-muted-foreground"
                    )}
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={cn(
                      "h-10 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all",
                      theme === "system" ? "border-primary bg-primary/5 text-primary font-bold" : "border-border/80 hover:bg-secondary text-muted-foreground"
                    )}
                  >
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
