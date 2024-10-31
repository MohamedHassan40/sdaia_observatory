"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";


// import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  

  return (
    <button
      // variant="ghost"
      // size="icon"
      className="hidden sm:flex items-center justify-start space-x-3"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="hidden h-[1.5rem] w-[1.3rem] dark:block" />
      <Moon className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
