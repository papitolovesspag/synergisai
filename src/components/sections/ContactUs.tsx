"use client";

import React, { useState } from "react";
import { Mail, Phone, ShieldCheck, CheckCircle2, Radio, Send } from "lucide-react";

export function ContactUs(): JSX.Element {
  const [formData, setFormData] = useState({
    fullName: "",
    organization: "",
    email: "",
    capexTier: "enterprise",
    scope: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.scope) {
      return;
    }
    setIsSubmitting(true);
    // Simulate instantaneous dispatch queue handshake
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 350);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      organization: "",
      email: "",
      capexTier: "enterprise",
      scope: "",
    });
  };

  return (
    <section id="contact" className="scroll-mt-24 py-20 space-y-12 dark:bg-carbon-950">
      {/* Header Section */}
      <div className="space-y-3 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-safety-orange/40 bg-safety-orange/10 font-mono text-xs uppercase tracking-widest text-safety-orange">
          <Radio className="w-3.5 h-3.5 animate-pulse text-safety-orange" />
          [ SECTION_05 // DISPATCH &amp; INTAKE ]
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-carbon-950 dark:text-chalk-100">
          DISPATCH CONTROL TOWER // INTAKE PROTOCOL
        </h2>
        <p className="text-carbon-600 dark:text-chalk-400 max-w-2xl text-sm sm:text-base leading-relaxed">
          Initiate technical RFP intake, digital twin corridor simulation, or sovereign infrastructure
          clearance review with our lead systems engineering command.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Details Column: Exactly 1 Email and Exactly 1 Phone */}
        <div className="space-y-4">
          {/* Email Intake Card */}
          <div className="relative p-6 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card space-y-3">
            <span className="pointer-events-none absolute -top-1.5 -left-1.5 text-xs font-mono text-neutral-400">
              +
            </span>
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4 text-safety-orange" />
              <span>OFFICIAL BUSINESS EMAIL</span>
            </div>
            <a
              href="mailto:uju@synergisai.site"
              className="block font-mono text-base font-bold text-carbon-950 dark:text-chalk-100 hover:text-safety-orange transition-colors selection:bg-safety-orange selection:text-white"
            >
              uju@synergisai.site
            </a>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Encrypted channel for prime contractor RFP packages, BIM model submissions, and
              vendor integration specifications.
            </p>
          </div>

          {/* Phone Hotline Card */}
          <div className="relative p-6 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card space-y-3">
            <span className="pointer-events-none absolute -top-1.5 -right-1.5 text-xs font-mono text-neutral-400">
              +
            </span>
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4 text-safety-orange" />
              <span>OPERATIONS DISPATCH TELEPHONE</span>
            </div>
            <a
              href="tel:+2347042350852"
              className="block font-mono text-base font-bold text-carbon-950 dark:text-chalk-100 hover:text-safety-orange transition-colors selection:bg-safety-orange selection:text-white"
            >
              +2347042350852
            </a>
            <p className="text-xs text-neutral-500 leading-relaxed">
              24/7 mission-critical operations dispatch for active mega-corridor incidents and
              liquidated damage escalations.
            </p>
          </div>

          {/* Neutral Architecture Compliance */}
          <div className="p-6 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card space-y-2">
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-safety-orange" />
              <span>INFRASTRUCTURE COMPLIANCE</span>
            </div>
            <p className="text-xs text-carbon-600 dark:text-chalk-400 leading-relaxed">
              Built on open industry standards including buildingSMART IFC4 data models, cryptographic
              tamper-evident audit trails, and multi-region sovereign host isolation.
            </p>
          </div>
        </div>

        {/* Interactive RFP Intake Form Column */}
        <div className="lg:col-span-2 relative p-8 rounded border border-chalk-300 dark:border-carbon-800 bg-white dark:bg-industrial-card">
          <span className="pointer-events-none absolute -top-1.5 -right-1.5 text-xs font-mono text-neutral-400">
            +
          </span>
          <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 text-xs font-mono text-neutral-400">
            +
          </span>

          {isSubmitted ? (
            <div className="space-y-6 py-8">
              <div className="p-6 rounded border border-safety-orange/50 bg-safety-orange/5 space-y-4">
                <div className="flex items-center gap-2.5 text-safety-orange font-mono text-sm font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>TRANSMISSION LOGGED // DISPATCH PROTOCOL QUEUED</span>
                </div>
                <p className="text-xs text-carbon-700 dark:text-chalk-300 font-mono leading-relaxed">
                  Your enterprise mega-project intake specification has been successfully logged into
                  the Synergis AI operational queue. An assigned Chief Systems Engineer will initiate
                  secure transmission review within 4 operational hours.
                </p>
                <div className="p-3 rounded bg-chalk-200 dark:bg-carbon-900 border border-chalk-300 dark:border-carbon-800 font-mono text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                  <div>PROTOCOL ID: SYN-INTAKE-QUEUE-CONFIRMED</div>
                  <div>STATUS: QUEUED FOR DISPATCH VERIFICATION</div>
                  <div>SECURITY CLEARANCE: STANDARD MULTI-TIER AUDIT</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider border border-safety-orange text-safety-orange hover:bg-safety-orange hover:text-white transition-colors"
              >
                SUBMIT ADDITIONAL INTAKE REQUEST
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs text-neutral-500 uppercase tracking-wider">
                    Full Name <span className="text-safety-orange">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Elena Rostova, PE"
                    className="w-full px-4 py-2.5 rounded border border-chalk-400 dark:border-carbon-700 bg-neutral-50 dark:bg-carbon-950 text-neutral-900 dark:text-neutral-100 font-sans text-sm focus:outline-none focus:border-safety-orange transition-colors"
                  />
                </div>

                {/* Organization */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs text-neutral-500 uppercase tracking-wider">
                    Organization / Agency Name <span className="text-safety-orange">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    placeholder="Mega-Corridor Joint Venture Prime"
                    className="w-full px-4 py-2.5 rounded border border-chalk-400 dark:border-carbon-700 bg-neutral-50 dark:bg-carbon-950 text-neutral-900 dark:text-neutral-100 font-sans text-sm focus:outline-none focus:border-safety-orange transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Official Business Email */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs text-neutral-500 uppercase tracking-wider">
                    Official Business Email <span className="text-safety-orange">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="e.rostova@example.com"
                    className="w-full px-4 py-2.5 rounded border border-chalk-400 dark:border-carbon-700 bg-neutral-50 dark:bg-carbon-950 text-neutral-900 dark:text-neutral-100 font-sans text-sm focus:outline-none focus:border-safety-orange transition-colors"
                  />
                </div>

                {/* Project Scope & CapEx Tier */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs text-neutral-500 uppercase tracking-wider">
                    Project Scope &amp; CapEx Tier <span className="text-safety-orange">*</span>
                  </label>
                  <select
                    value={formData.capexTier}
                    onChange={(e) =>
                      setFormData({ ...formData, capexTier: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded border border-chalk-400 dark:border-carbon-700 bg-neutral-50 dark:bg-carbon-950 text-neutral-900 dark:text-neutral-100 font-sans text-sm focus:outline-none focus:border-safety-orange transition-colors"
                  >
                    <option value="site">Site Core ($50M - $250M CapEx)</option>
                    <option value="enterprise">Enterprise Tower ($250M - $2B CapEx)</option>
                    <option value="sovereign">Sovereign Infrastructure ($2B+ CapEx)</option>
                  </select>
                </div>
              </div>

              {/* Scope & Technical Requirements */}
              <div className="space-y-2">
                <label className="block font-mono text-xs text-neutral-500 uppercase tracking-wider">
                  Corridor Scope &amp; Technical Requirements <span className="text-safety-orange">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.scope}
                  onChange={(e) =>
                    setFormData({ ...formData, scope: e.target.value })
                  }
                  placeholder="Describe critical path corridors, active BIM scheduling packages, and key multi-tier supplier milestones..."
                  className="w-full px-4 py-2.5 rounded border border-chalk-400 dark:border-carbon-700 bg-neutral-50 dark:bg-carbon-950 text-neutral-900 dark:text-neutral-100 font-sans text-sm focus:outline-none focus:border-safety-orange transition-colors"
                />
              </div>

              {/* Submit Dispatch Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded font-mono text-xs font-bold uppercase tracking-wider bg-safety-orange hover:bg-safety-orangeDark text-white shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? "TRANSMITTING INTAKE PROTOCOL..."
                      : "DISPATCH INTAKE REQUEST"}
                  </span>
                </button>

                <div className="font-mono text-[11px] text-neutral-500">
                  SECURE CHANNEL // 256-BIT ENCRYPTED INGEST
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
