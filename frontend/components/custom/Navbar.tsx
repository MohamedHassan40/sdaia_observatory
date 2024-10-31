"use client";
import Link from "next/link";
import React from "react";
import { Moon, Package2, Settings, Sun, Telescope } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { navbarLinks } from "@/constants/navbar";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { setTheme, theme } = useTheme();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Telescope className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">AI Observatory</span>
        </Link>
        <TooltipProvider>
          {navbarLinks.map((link) => (
            <Tooltip key={link.title}>
              <TooltipTrigger asChild>
                <Link
                  href={link.link}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {/* {link.icon({ className: "h-5 w-5" })} */}
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.title}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Sun className="hidden h-5 w-5 dark:block" />
                <Moon className="h-5 w-5 dark:hidden" />
                <span className="sr-only">Toggle Theme</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle Theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Navbar;
