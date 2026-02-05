"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Zap, Shield } from "lucide-react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <Brain className="w-20 h-20 text-primary mx-auto" />
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </motion.div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Smart Notes</span>
            <br />
            <span className="text-foreground">Powered by AI</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your learning with AI-powered note-taking. Get instant
            summaries, ask questions, and unlock insights from your notes.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/sign-up")}
              className="text-lg px-8 py-6"
            >
              Get Started Free
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/sign-in")}
              className="text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto"
        >
          {/* Feature 1 */}
          <div className="glass p-6 rounded-xl">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Summaries</h3>
            <p className="text-muted-foreground">
              Get instant AI-generated summaries of your notes for quick reviews
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass p-6 rounded-xl">
            <Brain className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Q&A</h3>
            <p className="text-muted-foreground">
              Ask questions and get contextual answers from your notes
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass p-6 rounded-xl">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Organized</h3>
            <p className="text-muted-foreground">
              Topic-based organization with tags for easy retrieval
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
