"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="relative inline-flex items-center justify-center w-10 h-10 rounded border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-400 font-mono text-xs transition-colors"
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-[#121214] text-neutral-700 dark:text-neutral-300 hover:text-safety-orange dark:hover:text-safety-orange hover:border-safety-orange/60 dark:hover:border-safety-orange/60 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-safety-orange shadow-sm"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-safety-orange transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-800 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}

export default ThemeToggle;
