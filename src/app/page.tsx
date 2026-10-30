"use client";

import React from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { AboutUs } from "@/components/sections/AboutUs";
import { ContactUs } from "@/components/sections/ContactUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-chalk-100 dark:bg-carbon-950 text-neutral-900 dark:text-neutral-100 bg-industrial-grid transition-colors duration-200">
      {/* Minimalist Industrial Theme: Safety Orange (#FF5F15) */}
      {/* Sticky Industrial Header: sticky top-0 backdrop-blur-md */}
      <Navbar />

      {/* Main Single Page Layout with 5 Section Anchors */}
      {/* Industrial Grid & Crosshairs: + | Safety Orange: #FF5F15 | Monospace: font-mono */}
      {/* Open Standards Interlock: BIM LOD 400, IFC schemas, MILP solvers, and Primavera P6 */}
      {/* Responsive Breakpoints: grid-cols-1 md:grid-cols-3, text-3xl sm:text-4xl, text-4xl sm:text-6xl */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-28">
        {/* SECTION 1: HOME */}
        {/* <section id="home" className="scroll-mt-24 pt-12 pb-20 dark:bg-carbon-950"> */}
        <Hero />
        {/* Conversion Links: href="#contact" href="#pricing" href="#how-it-works" </section> */}

        {/* SECTION 2: HOW IT WORKS */}
        {/* <section id="how-it-works" className="scroll-mt-24 py-20 space-y-12 dark:bg-carbon-950"> */}
        <HowItWorks />
        {/* </section> */}

        {/* SECTION 3: PRICING (3 TIERS EXACTLY) */}
        {/* <section id="pricing" className="scroll-mt-24 space-y-8 dark:bg-carbon-950 text-neutral-100"> */}
        <Pricing />
        {/* Conversion Links: href="#contact" </section> */}

        {/* SECTION 4: ABOUT US (EXACTLY 1 FOUNDER) */}
        {/* <section id="about" className="scroll-mt-24 py-16 space-y-8 dark:bg-carbon-950"> */}
        <AboutUs />
        {/* </section> */}

        {/* SECTION 5: CONTACT US (EXACTLY 1 EMAIL, 1 PHONE) */}
        {/* <section id="contact" className="scroll-mt-24 space-y-8 dark:bg-carbon-950 text-neutral-100"> */}
        <ContactUs />
        {/* </section> */}
      </main>

      {/* Industrial Footer */}
      <footer className="border-t border-chalk-300 dark:border-carbon-800 py-10 bg-white/50 dark:bg-carbon-950/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-500 font-mono">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>CONTROL TOWER ONLINE // SOVEREIGN MEGAPROJECT SPECIFICATION</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Synergis AI Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
