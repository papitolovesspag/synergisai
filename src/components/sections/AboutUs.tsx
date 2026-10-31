import React from "react";
import Image from "next/image";

export function AboutUs(): JSX.Element {
  return (
    <section id="about" className="scroll-mt-24 py-16 space-y-8">
      <div className="space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-safety-orange">
          [ SECTION_04 // LEADERSHIP &amp; MISSION ]
        </span>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-carbon-950 dark:text-chalk-100">
          MISSION &amp; ARCHITECTURE
        </h2>
        <p className="text-carbon-600 dark:text-chalk-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          Our mission is to eliminate schedule variances and liquidated
          damages in global civil infrastructure by equipping mega-project
          teams with autonomous, real-time supply chain intelligence,
          predictive risk mitigation, and sovereign execution.
        </p>
      </div>

      {/* Single Founder Profile (Chukwuka) */}
      <div className="p-8 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card max-w-3xl space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Founder Image with Industrial Crosshairs */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded border border-chalk-400 dark:border-carbon-700 bg-neutral-100 dark:bg-carbon-950 overflow-hidden shrink-0 shadow-sm">
            <Image
              src="/founder.jpg"
              alt="Chukwuka - Founder & CEO of Synergis AI"
              fill
              className="object-cover object-[center_20%]"
              sizes="(max-width: 640px) 128px, 144px"
              priority
            />
            <span className="pointer-events-none absolute -top-1 -left-1 text-[10px] font-mono text-safety-orange z-10">
              +
            </span>
            <span className="pointer-events-none absolute -bottom-1 -right-1 text-[10px] font-mono text-safety-orange z-10">
              +
            </span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-safety-orange/10 text-safety-orange font-mono text-[10px] uppercase font-bold tracking-wider">
              FOUNDER &amp; CEO
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-carbon-950 dark:text-chalk-100">
              Chukwuka
            </h3>
            <p className="text-xs font-mono text-neutral-500 uppercase">
              Infrastructure Systems Strategist &amp; Founder
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-carbon-600 dark:text-chalk-400 leading-relaxed">
          Chukwuka is a forward-thinking systems strategist and infrastructure innovator dedicated to revolutionizing how large-scale capital projects are delivered. Recognizing that public infrastructure mega-projects routinely hemorrhage billions due to fragmented supply chains, unpredictable material bottlenecks, and opaque contractor bidding, he founded Synergis AI to bring autonomous intelligence and predictive control to the global construction ecosystem. Combining strategic foresight with cutting-edge algorithmic forecasting, Chukwuka spearheads Synergis AI&apos;s mission to bridge public sector governance and industrial supply networks—ensuring multi-billion-dollar infrastructure ventures stay ahead of schedule, within budget, and built for the future.
        </p>
      </div>
    </section>
  );
}

export default AboutUs;
