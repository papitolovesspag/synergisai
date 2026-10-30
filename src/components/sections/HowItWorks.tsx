"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Layers3,
  FileCheck2,
  Truck,
  Cpu,
  Activity,
  AlertTriangle,
  RotateCcw,
  Zap,
  CheckCircle2,
  ChevronRight,
  Radio,
} from "lucide-react";

interface PipelineNode {
  id: string;
  stageNum: string;
  stageTag: string;
  title: string;
  description: string;
  telemetryPill: string;
  icon: React.ComponentType<{ className?: string }>;
  telemetryDetails: {
    label: string;
    value: string;
  }[];
  autonomousFunction: string;
  riskBuffer: string;
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: "procurement",
    stageNum: "STAGE 01",
    stageTag: "STAGE 01 // INGESTION",
    title: "Multi-Tier Procurement & BIM Ingestion",
    description:
      "Deconstructs 3D structural models (LOD 400) into 85,000+ serialized components. Automatically maps Tier-1, Tier-2, and Tier-3 suppliers.",
    telemetryPill: "1,420 Active Suppliers // 99.8% BOM Reconciled // 1.2s Sync",
    icon: Layers3,
    telemetryDetails: [
      { label: "BIM Serialized Components", value: "85,420 LOD 400" },
      { label: "Active Suppliers Mapped", value: "1,420 (Tiers 1-3)" },
      { label: "BOM Reconciliation Rate", value: "99.8% Matched" },
      { label: "Continuous Model Sync", value: "1.2s Real-Time" },
    ],
    autonomousFunction:
      "Deconstructs Revit & IFC 4.3 structural models down to raw steel heat numbers and concrete pour batches to expose sub-tier vendor bottlenecks before fabrication begins.",
    riskBuffer: "+18 Days Critical Path Buffer Established",
  },
  {
    id: "permitting",
    stageNum: "STAGE 02",
    stageTag: "STAGE 02 // GOVTECH",
    title: "GovTech & Regulatory Permitting Engine",
    description:
      "Sovereign compliance interlock cross-referencing federal DOT, USACE, and environmental permits against freight logistics to prevent work stoppages.",
    telemetryPill: "142 Clearances Active // 22 Jurisdictions // 0.0 hrs Hold Time",
    icon: FileCheck2,
    telemetryDetails: [
      { label: "Jurisdictions Interlocked", value: "22 (DOT, USACE, NEPA)" },
      { label: "Active Clearances Validated", value: "142 Clearances" },
      { label: "Regulatory Hold Time", value: "0.0 hrs (Zero-Touch)" },
      { label: "Automated Variance Lead", value: "14-Day Pre-emptive" },
    ],
    autonomousFunction:
      "Continuously monitors municipal, state, and federal regulatory clearinghouses. Generates and files automated variance affidavits whenever route modifications occur.",
    riskBuffer: "Zero Stoppage Injunctions Maintained",
  },
  {
    id: "logistics",
    stageNum: "STAGE 03",
    stageTag: "STAGE 03 // TELEMETRY",
    title: "Real-Time Site & Logistics Telemetry",
    description:
      "Multimodal transit geofencing across rail, barge, and long-haul flatbeds synchronized with micro-level laydown yard capacity and crane hoist windows.",
    telemetryPill: "312 Shipments Geofenced // 84.2% Laydown Utilized // 3.4 min Queue",
    icon: Truck,
    telemetryDetails: [
      { label: "Active Geofenced Shipments", value: "312 En-Route" },
      { label: "Laydown Yard Capacity", value: "84.2% Utilized" },
      { label: "Gate Queue Waiting Delay", value: "3.4 min Average" },
      { label: "Multimodal Transit Split", value: "Rail 44% / Barge 28% / Flatbed 28%" },
    ],
    autonomousFunction:
      "Synchronizes coastal vessel AIS feeds, Class I rail dispatch, and trailer OBD-II GPS with site tower crane hoist schedules to eliminate laydown congestion and carrier demurrage.",
    riskBuffer: "Demurrage Costs Reduced by 89%",
  },
  {
    id: "mitigation",
    stageNum: "STAGE 04",
    stageTag: "STAGE 04 // MITIGATION",
    title: "Autonomous Disruption Mitigation & Execution",
    description:
      "Sub-140ms Mixed-Integer Linear Programming (MILP) re-optimizer computing 400,000 permutations upon supply shock to eliminate schedule slippage and liquidated damages.",
    telemetryPill: "Sub-140ms Solver // $4.8M Damages Hedged // 0 Days Slippage",
    icon: Cpu,
    telemetryDetails: [
      { label: "Optimization Solver Latency", value: "< 140ms (MILP Engine)" },
      { label: "Liquidated Damages Hedged", value: "$4.8M Prevented" },
      { label: "Critical Path Slippage", value: "0 Days Impact" },
      { label: "Shock Permutation Branches", value: "400,000 Branch Scans" },
    ],
    autonomousFunction:
      "When a severe corridor anomaly strikes, the MILP solver evaluates 400,000 supply paths in under 140ms, issuing autonomous spot freight contracts and rescheduling critical-path dependencies.",
    riskBuffer: "94% Autonomy / Zero Human Latency",
  },
];

export function HowItWorks(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationComplete, setSimulationComplete] = useState<boolean>(false);

  // Framer Motion scroll binding
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  // Segment transforms for each inter-node conduit
  const seg1Progress = useTransform(smoothProgress, [0.05, 0.35], [0, 1]);
  const seg2Progress = useTransform(smoothProgress, [0.35, 0.65], [0, 1]);
  const seg3Progress = useTransform(smoothProgress, [0.65, 0.95], [0, 1]);

  const activeNode = PIPELINE_NODES[selectedNodeIndex];

  const handleSimulateDisruption = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 1200);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationComplete(false);
  };

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="scroll-mt-24 py-20 space-y-12 dark:bg-carbon-950"
    >
      {/* Narrative Section Header */}
      <div className="space-y-3 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-safety-orange/40 bg-safety-orange/10 font-mono text-xs uppercase tracking-widest text-safety-orange">
          <Activity className="w-3.5 h-3.5 animate-pulse text-safety-orange" />
          [ SYSTEM ARCHITECTURE // PIPELINE ]
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-carbon-950 dark:text-chalk-100">
          HOW IT WORKS: AUTONOMOUS MEGAPROJECT CONTROL TOWER
        </h2>
        <p className="text-carbon-600 dark:text-chalk-400 max-w-3xl text-sm sm:text-base leading-relaxed">
          From BIM models and multi-tier subcontracts to real-time site
          telemetry and automated contractual mitigation. Synergis AI closes the
          loop between digital schedules and physical jobsite execution.
        </p>
      </div>

      {/* Desktop Horizontal Conduit Line (Width >= 1024px) */}
      <div className="hidden lg:block relative w-full h-8 px-8">
        <svg
          viewBox="0 0 1000 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Inactive conduit baseline */}
          <path
            d="M 125 16 L 875 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="text-chalk-400 dark:text-carbon-700"
          />

          {/* Active animated conduit with pathLength */}
          <motion.path
            d="M 125 16 L 875 16"
            stroke="#FF5F15"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ pathLength: smoothProgress }}
          />

          {/* Stage Node Junction Beacons */}
          {[125, 375, 625, 875].map((cx, idx) => (
            <g key={idx}>
              <circle
                cx={cx}
                cy="16"
                r="7"
                className={
                  selectedNodeIndex === idx
                    ? "fill-safety-orange"
                    : "fill-white dark:fill-carbon-900 stroke-safety-orange"
                }
                stroke="#FF5F15"
                strokeWidth="2"
              />
              <circle
                cx={cx}
                cy="16"
                r="3"
                className={
                  selectedNodeIndex === idx
                    ? "fill-white"
                    : "fill-safety-orange"
                }
              />
            </g>
          ))}
        </svg>
      </div>

      {/* 4-Stage Operational Node Pipeline Grid */}
      <div className="relative">
        {/* Mobile Vertical Spine Conduit (Width < 1024px) */}
        <div className="lg:hidden absolute left-5 top-8 bottom-8 w-1 pointer-events-none">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <line
              x1="2"
              y1="0"
              x2="2"
              y2="100%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="text-chalk-400 dark:text-carbon-700"
            />
            <motion.path
              d="M 2 0 L 2 1200"
              stroke="#FF5F15"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: smoothProgress }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {PIPELINE_NODES.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNodeIndex === index;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                onClick={() => setSelectedNodeIndex(index)}
                className={`relative p-6 rounded cursor-pointer transition-all duration-200 border flex flex-col justify-between space-y-5 ${
                  isSelected
                    ? "border-safety-orange bg-safety-orange/5 dark:bg-carbon-900 shadow-lg shadow-safety-orange/10 ring-1 ring-safety-orange"
                    : "border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card hover:border-safety-orange/50 hover:bg-chalk-50 dark:hover:bg-carbon-900/60"
                }`}
              >
                {/* Precision Industrial Corner Crosshairs */}
                <span className="pointer-events-none absolute -top-1.5 -left-1.5 text-xs font-mono text-safety-orange/70">
                  +
                </span>
                <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 text-xs font-mono text-safety-orange/70">
                  +
                </span>

                <div className="space-y-4">
                  {/* Stage Enumerator & Icon */}
                  <div className="flex items-center justify-between border-b border-chalk-200 dark:border-carbon-800 pb-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
                      {node.stageTag}
                    </span>
                    <div
                      className={`p-2 rounded ${
                        isSelected
                          ? "bg-safety-orange text-white"
                          : "bg-chalk-200 dark:bg-carbon-800 text-safety-orange"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Node Title */}
                  <h3 className="font-bold text-base sm:text-lg text-carbon-950 dark:text-chalk-100 leading-snug">
                    {node.title}
                  </h3>

                  {/* Node Description */}
                  <p className="text-xs text-carbon-600 dark:text-chalk-400 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                {/* Telemetry Pill Badge */}
                <div className="pt-3 border-t border-chalk-200 dark:border-carbon-800 space-y-2">
                  <div className="px-2.5 py-1.5 rounded bg-chalk-100 dark:bg-carbon-950 border border-chalk-300 dark:border-carbon-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    <span className="text-safety-orange font-bold mr-1">
                      [TELEMETRY]
                    </span>
                    {node.telemetryPill}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-safety-orange">
                    <span className="uppercase tracking-wider font-semibold">
                      {isSelected ? "ACTIVE INSPECTOR" : "INSPECT STAGE"}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? "rotate-90 text-safety-orange" : ""
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Telemetry Inspector & Disruption Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 rounded border-2 border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card space-y-6 relative"
      >
        <span className="pointer-events-none absolute -top-1.5 -left-1.5 text-xs font-mono text-safety-orange">
          +
        </span>
        <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 text-xs font-mono text-safety-orange">
          +
        </span>

        {/* Inspector Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-chalk-200 dark:border-carbon-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-safety-orange font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-safety-orange" />
              TELEMETRY INSPECTOR // {activeNode.stageTag}
            </div>
            <h4 className="text-xl font-black uppercase text-carbon-950 dark:text-chalk-100">
              {activeNode.title}
            </h4>
          </div>

          {/* Simulation Trigger Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSimulateDisruption}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider bg-safety-orange hover:bg-safety-orangeDark text-white shadow-sm transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  EVALUATING 400,000 PERMUTATIONS...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  Simulate Supply Chain Disruption &amp; Rerouting
                </>
              )}
            </button>
            {simulationComplete && (
              <button
                type="button"
                onClick={handleResetSimulation}
                className="p-2.5 rounded border border-chalk-300 dark:border-carbon-700 text-neutral-600 dark:text-neutral-400 hover:text-safety-orange transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Simulation Feedback Alert */}
        {simulationComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded border border-safety-orange bg-safety-orange/10 text-neutral-900 dark:text-neutral-100 space-y-2 font-mono text-xs"
          >
            <div className="flex items-center gap-2 font-bold uppercase text-safety-orange">
              <AlertTriangle className="w-4 h-4 text-safety-orange shrink-0" />
              DISRUPTION RESOLVED: SUB-140ms MILP RE-OPTIMIZER EXECUTION
            </div>
            <p className="text-carbon-700 dark:text-chalk-300 leading-relaxed">
              ANOMALY INJECTED: 72-hour inland freight lock closure on critical-path structural steel.
              The Mixed-Integer Linear Programming (MILP) solver evaluated 400,000 supply permutations
              in 64ms, autonomously rerouting 14 shipments via Class I rail corridor, issuing automated
              USACE permit amendments, and preserving $4.8M in liquidated damages with 0 days schedule slippage.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-safety-orange font-bold">
              <span>SOLVER: 64ms LATENCY</span>
              <span>•</span>
              <span>DAMAGE HEDGED: $4,800,000</span>
              <span>•</span>
              <span>SLIPPAGE: 0.0 DAYS</span>
              <span>•</span>
              <span>AUTONOMY: 100% UNASSISTED</span>
            </div>
          </motion.div>
        )}

        {/* Real-time Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activeNode.telemetryDetails.map((metric, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded border border-chalk-200 dark:border-carbon-800 bg-chalk-50 dark:bg-carbon-900/60 space-y-1"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                {metric.label}
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-carbon-950 dark:text-chalk-100">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Autonomous Core Logic Explanatory Box */}
        <div className="p-4 rounded border border-chalk-200 dark:border-carbon-800 bg-chalk-50 dark:bg-carbon-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1 max-w-2xl">
            <span className="font-mono text-[10px] uppercase font-bold text-safety-orange">
              AUTONOMOUS LOGIC SPECIFICATION
            </span>
            <p className="text-carbon-600 dark:text-chalk-400 leading-relaxed">
              {activeNode.autonomousFunction}
            </p>
          </div>
          <div className="shrink-0 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {activeNode.riskBuffer}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default HowItWorks;
