"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface PricingTier {
  id: string;
  tierNumber: string;
  name: string;
  badge?: string;
  description: string;
  monthlyRate: number;
  customRate?: string;
  scopeCapEx: string;
  features: string[];
  ctaText: string;
  isFeatured?: boolean;
}

const TIERS: PricingTier[] = [
  {
    id: "site-core",
    tierNumber: "TIER 01",
    name: "Site Core",
    description:
      "For regional civil corridors and general contractors managing up to $250M in project CapEx.",
    monthlyRate: 4800,
    scopeCapEx: "Up to $250M Program CapEx",
    features: [
      "1 Active Mega-Corridor",
      "LOD 300 / LOD 400 BIM Ingestion",
      "24h Predictive Lookahead & Variance Warnings",
      "Primavera P6 & Procore Live Sync (Hourly)",
      "Sub-250ms MILP Disruption Rerouting",
      "Telemetry Ingest: 50 IoT & Drone Streams",
    ],
    ctaText: "DEPLOY SITE CORE",
    isFeatured: false,
  },
  {
    id: "enterprise-tower",
    tierNumber: "TIER 02",
    name: "Enterprise Tower",
    badge: "RECOMMENDED SPEC",
    description:
      "Complete autonomous command across critical civil works and joint-ventures from $250M to $2B.",
    monthlyRate: 14500,
    scopeCapEx: "Up to $2B Joint Venture CapEx",
    features: [
      "Unlimited Multi-Tier Supplier Mapping",
      "Sub-Tier Vendor Graph & Risk Interlock",
      "Real-Time GovTech Clearance & Permitting Interlock",
      "LOD 400 BIM Ingestion & Full Deconstruction",
      "Sub-140ms Continuous MILP Disruption Solver",
      "Multimodal Logistics Telematics (Rail, Truck & AIS Port)",
      "Automated Contractual Variance Filings",
    ],
    ctaText: "DEPLOY ENTERPRISE TOWER",
    isFeatured: true,
  },
  {
    id: "sovereign-infrastructure",
    tierNumber: "TIER 03",
    name: "Sovereign Infrastructure",
    description:
      "Dedicated sovereign deployment for national civil works, defense corridors, and $2B+ megaprojects.",
    monthlyRate: 48000,
    customRate: "CUSTOM",
    scopeCapEx: "$2B+ Sovereign Capital Works",
    features: [
      "Multi-Agency DOT & USACE Clearinghouse Interlock",
      "Air-Gapped Sovereign Infrastructure Deployment",
      "Custom MILP Heuristics & Mathematical Solver Models",
      "Real-Time Drone Photogrammetry Ingest & Digital Twin",
      "Dedicated Systems Engineer Assigned",
      "Cryptographic Audit Logs & Multi-Tenant Isolation",
      "Custom Enterprise ERP & Oracle Primavera Integrations",
    ],
    ctaText: "CONTACT SOVEREIGN DESK",
    isFeatured: false,
  },
];

export function Pricing(): JSX.Element {
  const [isAnnual, setIsAnnual] = useState(false);

  // Annual commitment formula provides a 15% discount (0.85 multiplier)
  const calculateRate = (monthlyRate: number): string => {
    if (isAnnual) {
      const discounted = Math.round(monthlyRate * 0.85);
      return `$${discounted.toLocaleString()}`;
    }
    return `$${monthlyRate.toLocaleString()}`;
  };

  return (
    <section id="pricing" className="scroll-mt-24 py-20 space-y-12 dark:bg-carbon-950">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-safety-orange/40 bg-safety-orange/10 font-mono text-xs uppercase tracking-widest text-safety-orange">
            <Zap className="w-3.5 h-3.5 text-safety-orange" />
            [ SECTION_03 // COMMERCIAL ALLOCATION ]
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-carbon-950 dark:text-chalk-100">
            COMMERCIAL DEPLOYMENT // CAPITAL ALLOCATION
          </h2>
          <p className="text-carbon-600 dark:text-chalk-400 text-sm sm:text-base leading-relaxed">
            Autonomous control tower licensing structured for sovereign and enterprise capital
            works. Liquidated damage mitigation and critical path optimization guaranteed.
          </p>
        </div>

        {/* Interactive Billing Frequency Switch */}
        <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
          <div className="inline-flex items-center p-1 rounded border border-chalk-400 dark:border-carbon-700 bg-chalk-200 dark:bg-carbon-900 font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded transition-all font-bold uppercase tracking-wider ${
                !isAnnual
                  ? "bg-white dark:bg-industrial-card text-carbon-950 dark:text-chalk-100 shadow-sm border border-chalk-300 dark:border-carbon-700"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded transition-all font-bold uppercase tracking-wider flex items-center gap-2 ${
                isAnnual
                  ? "bg-safety-orange text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <span>Annual Commitment</span>
            </button>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-safety-orange/10 border border-safety-orange/30 text-safety-orange font-mono text-[11px] font-bold tracking-wider uppercase">
            <span>15% SAVINGS // ANNUAL COMMITMENT</span>
          </div>
        </div>
      </div>

      {/* Pricing Matrix: Exactly 3 Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TIERS.map((tier) => {
          const isFeatured = tier.isFeatured;
          const displayRate = tier.customRate
            ? tier.customRate
            : calculateRate(tier.monthlyRate);

          return (
            <div
              key={tier.id}
              className={`relative p-8 rounded flex flex-col justify-between space-y-6 transition-all ${
                isFeatured
                  ? "border-2 border-safety-orange bg-white dark:bg-industrial-card shadow-lg shadow-safety-orange/5"
                  : "border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card"
              }`}
            >
              {/* Corner crosshairs */}
              <span
                className={`pointer-events-none absolute -top-1.5 ${
                  isFeatured ? "-right-1.5 text-safety-orange" : "-left-1.5 text-neutral-400"
                } text-xs font-mono`}
              >
                +
              </span>
              <span
                className={`pointer-events-none absolute -bottom-1.5 ${
                  isFeatured ? "-left-1.5 text-safety-orange" : "-right-1.5 text-neutral-400"
                } text-xs font-mono`}
              >
                +
              </span>

              {/* Recommended Badge */}
              {isFeatured && tier.badge && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded bg-safety-orange text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow">
                  {tier.badge}
                </div>
              )}

              <div className="space-y-4">
                {/* Monospace Tier Header */}
                <div
                  className={`font-mono text-xs uppercase tracking-wider ${
                    isFeatured ? "text-safety-orange font-bold" : "text-neutral-500"
                  }`}
                >
                  {tier.tierNumber} {"//"} {tier.scopeCapEx}
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight text-carbon-950 dark:text-chalk-100">
                  {tier.name}
                </h3>

                <p className="text-xs text-carbon-600 dark:text-chalk-400 min-h-[36px] leading-relaxed">
                  {tier.description}
                </p>

                {/* Rate Display */}
                <div className="pt-2 border-t border-chalk-200 dark:border-carbon-800">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-mono text-3xl font-black ${
                        isFeatured
                          ? "text-safety-orange"
                          : "text-carbon-950 dark:text-chalk-100"
                      }`}
                    >
                      {displayRate}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      {tier.customRate ? " / from $48,000/mo" : " / month"}
                    </span>
                  </div>
                  {isAnnual && !tier.customRate && (
                    <div className="font-mono text-[11px] text-safety-orange font-semibold mt-1">
                      Billed annually (-15% discount applied)
                    </div>
                  )}
                  {!isAnnual && !tier.customRate && (
                    <div className="font-mono text-[11px] text-neutral-400 mt-1">
                      Standard monthly disbursement schedule
                    </div>
                  )}
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-2.5 pt-4 text-xs font-mono text-carbon-600 dark:text-chalk-400 border-t border-chalk-300 dark:border-carbon-800">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-safety-orange shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dedicated CTA Button */}
              <Link
                href="#contact"
                className={`w-full py-3.5 rounded text-center font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                  isFeatured
                    ? "bg-safety-orange hover:bg-safety-orangeDark text-white shadow-sm"
                    : "border border-chalk-400 dark:border-carbon-700 bg-white dark:bg-industrial-card text-neutral-800 dark:text-neutral-200 hover:border-safety-orange hover:text-safety-orange"
                }`}
              >
                {tier.ctaText}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Industrial Assurance Footnote */}
      <div className="p-4 rounded border border-chalk-300 dark:border-carbon-800 bg-chalk-200/50 dark:bg-carbon-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-safety-orange shrink-0" />
          <span>CAPEX GUARANTEE: Liquidated damage indemnification &amp; sub-140ms continuous MILP solver</span>
        </div>
        <div className="text-[11px] text-neutral-500">
          Base rates: Site Core $4,800/mo ($4,080/mo annual) | Enterprise Tower $14,500/mo ($12,325/mo annual) | Sovereign Infrastructure Custom
        </div>
      </div>
    </section>
  );
}
