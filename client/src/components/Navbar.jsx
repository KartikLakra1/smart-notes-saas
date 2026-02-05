"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Sparkles, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user } = useUser();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="w-8 h-8 text-primary" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Notes Guru</h1>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted-foreground hidden md:block">
              Welcome, {user.firstName || user.username}
            </span>
          )}
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </motion.nav>
  );
}
