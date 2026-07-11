"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Table2, Square, Box, Percent, TrendingUp, 
  PlusCircle, MinusCircle, Brain, Target, Award,
  ChevronDown, ArrowRight, Keyboard, Zap, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { topics, Topic } from "@/data/topics";

export default function Home() {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { toast } = useToast();

  // Listen to custom command palette select event
  useEffect(() => {
    const handleSelectTopic = (e: Event) => {
      const customEvent = e as CustomEvent;
      const topicId = customEvent.detail.id;
      const matched = topics.find((t) => t.id === topicId);
      if (matched) {
        setActiveTopic(matched);
      }
    };
    window.addEventListener("select-topic", handleSelectTopic);
    return () => window.removeEventListener("select-topic", handleSelectTopic);
  }, []);

  const handleStartPracticeMock = (topicName: string) => {
    window.location.href = `/practice`;
  };

  // Map icon name to Lucide React component
  const renderTopicIcon = (iconName: string) => {
    const map: Record<string, React.ReactNode> = {
      Table2: <Table2 className="h-6 w-6 text-indigo-500" />,
      Square: <Square className="h-6 w-6 text-teal-500" />,
      Box: <Box className="h-6 w-6 text-amber-500" />,
      Percent: <Percent className="h-6 w-6 text-emerald-500" />,
      TrendingUp: <TrendingUp className="h-6 w-6 text-blue-500" />,
      PlusCircle: <PlusCircle className="h-6 w-6 text-indigo-500" />,
      MinusCircle: <MinusCircle className="h-6 w-6 text-pink-500" />,
      Multiply: <Sparkles className="h-6 w-6 text-violet-500" />,
      Divide: <Brain className="h-6 w-6 text-cyan-500" />,
      Shuffle: <Brain className="h-6 w-6 text-rose-500" />,
      Hash: <Zap className="h-6 w-6 text-purple-500" />,
    };
    return map[iconName] || <Brain className="h-6 w-6 text-indigo-500" />;
  };

  const getDifficultyBadge = (diff: Topic["difficulty"]) => {
    const badgeMap = {
      Easy: <Badge variant="easy">Easy</Badge>,
      Medium: <Badge variant="medium">Medium</Badge>,
      Hard: <Badge variant="hard">Hard</Badge>,
    };
    return badgeMap[diff];
  };

  const stats = [
    { label: "Calculations Solved", value: "8,419,250+" },
    { label: "Active Mind Trainers", value: "48,200+" },
    { label: "Avg Speed Improvement", value: "3.4x" },
    { label: "Ideal Recall Time", value: "< 1.5s" },
  ];

  const faqs = [
    {
      q: "How does mental math speed training actually help?",
      a: "Regular mental arithmetic practice strengthens neural pathways involved in working memory and number sense. Students who train for just 10 minutes daily show measurable improvements in exam scores, particularly in quantitative sections of tests like the SAT, GRE, GMAT, and CAT."
    },
    {
      q: "How often should I practice to see real results?",
      a: "Consistency matters more than session length. Practising 5 to 10 minutes every day builds stronger mental shortcuts than a single hour-long session once a week. Most users notice faster recall within two weeks of daily practice."
    },
    {
      q: "Is SpeedMaths free to use?",
      a: "Yes, completely free. There are no accounts, subscriptions, or paywalls. All learning materials, practice drills, and analytics features are available to everyone without registration."
    },
    {
      q: "What topics can I practice?",
      a: "You can practice multiplication tables (1 to 50), squares (1 to 100), cubes (1 to 50), power tables, fractions to decimals, addition, subtraction, multiplication, division, and mixed operations — with multiple difficulty levels and question formats."
    }
  ];

  // Floating math symbols logic
  const mathFloatingSymbols = [
    { text: "x²", top: "15%", left: "8%", delay: 0 },
    { text: "√169", top: "25%", left: "85%", delay: 1.5 },
    { text: "π", top: "65%", left: "5%", delay: 0.5 },
    { text: "3.14", top: "78%", left: "90%", delay: 2 },
    { text: "2³ = 8", top: "80%", left: "15%", delay: 1 },
    { text: "1/8 = 12.5%", top: "18%", left: "70%", delay: 2.5 },
  ];

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Grid background styling */}
      <div className="absolute inset-0 grid-bg -z-10" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        {/* Floating math elements */}
        {mathFloatingSymbols.map((item, index) => (
          <motion.div
            key={index}
            className="absolute hidden md:block text-2xl font-mono font-bold text-primary/10 dark:text-primary/20 pointer-events-none select-none"
            style={{ top: item.top, left: item.left }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            {item.text}
          </motion.div>
        ))}

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>Introducing Phase 1 Sandbox UI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight"
          >
            Supercharge Your Mental Calculation{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-teal-500 bg-clip-text text-transparent">
              Speed & Recall
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            SpeedMaths is a high-performance training deck built for professionals, students, and competitors. Master times tables, squares, power limits, and fractions under a responsive, premium UI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Button
              variant="premium"
              size="lg"
              onClick={() => {
                const el = document.getElementById("topics");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Start Practising
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const el = document.getElementById("features");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn Methods
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border/20 scroll-mt-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Extreme Mental Performance
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Explore premium features designed to eliminate computational friction and elevate processing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card hoverEffect className="glassmorphism">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Keyboard className="h-6 w-6" />
              </div>
              <CardTitle>Keyboard Driven</CardTitle>
              <CardDescription className="pt-2 leading-relaxed">
                Open search parameters and toggle topics instantly using the Command Palette shortcut (<kbd className="rounded border bg-muted px-1 text-xs">Ctrl+K</kbd>).
              </CardDescription>
            </CardHeader>
          </Card>

          <Card hoverEffect className="glassmorphism">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <CardTitle>Mental Sandbox</CardTitle>
              <CardDescription className="pt-2 leading-relaxed">
                Review preparation guides and master mental shortcuts. Expand decimal-to-fraction or prime number characteristics seamlessly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card hoverEffect className="glassmorphism">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription className="pt-2 leading-relaxed">
                Unlock detailed charts detailing accuracy trends, average response latency, daily drills logs, and percentile milestones.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Topic Cards Section */}
      <section id="topics" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border/20 scroll-mt-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Practice Field
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Explore 11 customized calculation topics tailored across varying difficulty thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="h-full flex flex-col justify-between glassmorphism relative overflow-hidden group hover:border-primary/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
                      {renderTopicIcon(topic.iconName)}
                    </div>
                    {getDifficultyBadge(topic.difficulty)}
                  </div>
                  <CardTitle className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="pt-2 text-sm leading-relaxed line-clamp-2">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-xs text-muted-foreground flex gap-4 pt-0">
                  <div>
                    <span className="font-semibold text-foreground">Questions: </span>
                    {topic.estQuestions}
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-border/30">
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold cursor-pointer group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all"
                    onClick={() => setActiveTopic(topic)}
                  >
                    Open Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border/20 scroll-mt-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-center">
          
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Speed Mental Arithmetic?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Calculators solve equations, but a fast mind changes how you think. Develop sharp focus and lightning quick recall speeds that stay with you.
            </p>
          </div>

          <div className="mt-12 lg:mt-0 lg:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex gap-4 p-5 rounded-2xl border border-border/60 bg-card/40 glassmorphism">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Cognitive Agility</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Enhance spatial memory, logical reasoning capabilities, and split-second quantitative choices.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border border-border/60 bg-card/40 glassmorphism">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Test Preparation</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Earn a competitive advantage in GRE, GMAT, CAT, and business interview math assessment tests.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border border-border/60 bg-card/40 glassmorphism">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Technical Confidence</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Understand logs, complexity bounds, equations, and factorizations in coding reviews quickly.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border border-border/60 bg-card/40 glassmorphism">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Daily Utility</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Calculate tips, compute bill splits, verify sales discounts, and manage investments without drawing tools.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border/20 scroll-mt-16">
        <div className="rounded-3xl border border-primary/10 bg-gradient-to-r from-primary/5 via-violet-500/5 to-teal-500/5 p-8 sm:p-12 glassmorphism relative overflow-hidden">
          
          <div className="relative z-10 grid grid-cols-2 gap-8 lg:grid-cols-4 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-border/20 scroll-mt-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Clear responses to typical speed math workout queries.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={index}
                className="border border-border/80 rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-0 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-indigo-700 dark:to-indigo-950 text-white shadow-2xl p-8 sm:p-16 text-center">
          
          {/* Subtle glowing elements */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl -z-10" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Upgrade Your Recall?
            </h2>
            <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed">
              Start building your mental scratchpad today. Open the Topic Cards and check the shortcuts. Sandbox practice awaits.
            </p>
            <div className="pt-4">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-neutral-100 hover:shadow-lg active:scale-98 shadow-md"
                onClick={() => {
                  const el = document.getElementById("topics");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Explore Topics Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Dialog for Topic Cards */}
      <Dialog
        isOpen={activeTopic !== null}
        onClose={() => setActiveTopic(null)}
        title={activeTopic?.title || ""}
        description="Review the preparation drills, tricks, and formulas before starting math workouts."
      >
        {activeTopic && (
          <div className="space-y-6">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {getDifficultyBadge(activeTopic.difficulty)}
              <Badge variant="outline">{activeTopic.estQuestions} Questions</Badge>
            </div>

            {/* Preparation Tips */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Mental Arithmetic Shortcuts
              </h4>
              <ul className="space-y-2 text-sm text-foreground">
                {activeTopic.preparationTips.map((tip, index) => (
                  <li key={index} className="flex gap-2 items-start">
                    <span className="font-bold text-primary">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview of Questions */}
            <div className="space-y-2.5 rounded-xl border border-border/80 bg-secondary/30 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Sample Calculation Drill
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {activeTopic.previewQuestions.map((q, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-3 rounded-lg border border-border bg-card font-mono text-sm font-semibold text-center"
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="pt-2">
              <Button
                variant="premium"
                className="w-full"
                onClick={() => handleStartPracticeMock(activeTopic.title)}
              >
                Launch Speed Drill
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
