"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Notes Guru</h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && <UserButton afterSignOutUrl="/sign-in" />}
        </div>
      </div>
    </nav>
  );
}
