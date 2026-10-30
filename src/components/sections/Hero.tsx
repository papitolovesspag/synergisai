"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";

export function Hero(): JSX.Element {
  return (
    <section id="home" className="scroll-mt-24 pt-12 pb-20">
      <div className="space-y-6 max-w-4xl">
        {/* SCADA Status Beacon Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-safety-orange/40 bg-safety-orange/10 text-safety-orange font-mono text-xs uppercase tracking-widest">
          <Radio className="w-3.5 h-3.5 animate-pulse text-safety-orange" />
          [CONTROL TOWER: SYNCHRONIZED] // MEGAPROJECT INFRASTRUCTURE
        </div>

        {/* Minimalist Industrial Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-tight text-carbon-950 dark:text-chalk-100">
          AUTONOMOUS SUPPLY CHAIN CONTROL TOWER FOR{" "}
          <span className="text-safety-orange">MEGA-PROJECTS</span>
        </h1>

        <p className="text-base sm:text-lg text-carbon-600 dark:text-chalk-400 max-w-3xl leading-relaxed">
          Eliminate multi-million dollar schedule variances and liquidated
          damages. Synergis AI autonomously synthesizes multi-tier supplier
          ERPs, BIM LOD 400 schedules, and GovTech regulatory clearinghouses
          with sub-140ms disruption mitigation.
        </p>

        {/* Conversion Funnel CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-mono text-sm font-bold uppercase tracking-wider bg-safety-orange hover:bg-safety-orangeDark text-white shadow-sm transition-all"
          >
            LAUNCH CONTROL TOWER
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded font-mono text-sm font-bold uppercase tracking-wider border border-chalk-400 dark:border-carbon-700 bg-white dark:bg-industrial-card text-neutral-800 dark:text-neutral-200 hover:border-safety-orange transition-colors"
          >
            VIEW SPECIFICATIONS
          </Link>
        </div>

        {/* Industrial Telemetry KPI HUD Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          <div className="p-4 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card">
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
              CAPITAL MONITORED
            </div>
            <div className="text-2xl font-mono font-bold text-carbon-950 dark:text-chalk-100 pt-1">
              $12.4B+
            </div>
            <div className="text-[11px] font-mono text-neutral-500 pt-1">
              $12.4B Capital Monitored
            </div>
          </div>
          <div className="p-4 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card">
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
              ON-TIME DISPATCH
            </div>
            <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              99.4%
            </div>
            <div className="text-[11px] font-mono text-neutral-500 pt-1">
              99.4% On-Time Dispatch
            </div>
          </div>
          <div className="p-4 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card">
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
              SOLVER LATENCY
            </div>
            <div className="text-2xl font-mono font-bold text-safety-orange pt-1">
              &lt; 140ms
            </div>
            <div className="text-[11px] font-mono text-neutral-500 pt-1">
              Sub-140ms MILP Solver
            </div>
          </div>
          <div className="p-4 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card">
            <div className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
              ACTIVE CORRIDORS
            </div>
            <div className="text-2xl font-mono font-bold text-carbon-950 dark:text-chalk-100 pt-1">
              142
            </div>
            <div className="text-[11px] font-mono text-neutral-500 pt-1">
              142 Active Corridors
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
