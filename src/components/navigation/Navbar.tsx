"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X } from "lucide-react";

export function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#home", label: "01 // Home" },
    { href: "#how-it-works", label: "02 // Pipeline" },
    { href: "#pricing", label: "03 // Pricing" },
    { href: "#about", label: "04 // About" },
    { href: "#contact", label: "05 // Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-carbon-950/85 border-b border-chalk-300 dark:border-carbon-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Mark */}
        <Link href="#home" className="flex items-center gap-3 group">
          <BrandLogo size={36} className="text-safety-orange" />
          <div className="flex flex-col">
            <span className="font-black tracking-widest text-sm uppercase text-neutral-900 dark:text-neutral-50 group-hover:text-safety-orange transition-colors">
              SYNERGIS AI
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
              CONTROL TOWER v4.2
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-safety-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded border border-chalk-300 dark:border-carbon-800 bg-chalk-200 dark:bg-industrial-card font-mono text-[10px] text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>TELEMETRY ONLINE</span>
          </div>

          <ThemeToggle />

          <Link
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded font-mono text-xs font-bold uppercase tracking-wider bg-safety-orange hover:bg-safety-orangeDark text-white shadow-sm transition-colors"
          >
            DEPLOY TOWER
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="md:hidden p-2 rounded text-neutral-600 dark:text-neutral-400 hover:text-safety-orange focus:outline-none focus:ring-1 focus:ring-safety-orange"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-chalk-300 dark:border-carbon-800 bg-white/95 dark:bg-carbon-950/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-4 font-mono text-xs uppercase tracking-wider animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 px-3 rounded hover:bg-safety-orange/10 hover:text-safety-orange text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-chalk-300 dark:border-carbon-800 flex flex-col gap-3">
            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded font-bold uppercase bg-safety-orange hover:bg-safety-orangeDark text-white shadow-sm transition-colors"
            >
              DEPLOY TOWER
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
