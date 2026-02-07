"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-semibold">Notes Guru</h1>
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => router.push("/sign-in")}
              className="text-sm md:text-base"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/sign-up")}
              className="text-sm md:text-base"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Smart Notes with AI
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, organize, and learn from your notes with AI-powered
            summaries and insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => router.push("/sign-up")}
              className="w-full sm:w-auto"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/sign-in")}
              className="w-full sm:w-auto"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24">
          <div className="space-y-2">
            <h3 className="font-semibold text-base md:text-lg">AI Summaries</h3>
            <p className="text-muted-foreground text-sm">
              Get instant summaries of your notes
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-base md:text-lg">Smart Q&A</h3>
            <p className="text-muted-foreground text-sm">
              Ask questions about your notes
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2 md:col-span-1">
            <h3 className="font-semibold text-base md:text-lg">Organized</h3>
            <p className="text-muted-foreground text-sm">
              Topic-based organization with tags
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
