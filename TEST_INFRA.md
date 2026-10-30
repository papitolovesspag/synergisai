# Synergis AI: E2E Test Infrastructure & Strategy (TEST_INFRA.md)

**Document Version**: 1.0.0  
**Status**: APPROVED  
**Author**: E2E Test Writer (`teamwork_preview_test_writer_m0`)  
**Scope**: Requirement-Driven, Opaque-Box Standalone E2E Verification Suite for Synergis AI  
**Authoritative References**:
- `c:\Users\Chidi\Documents\Web Dev Projects\.agents\teamwork\ORIGINAL_REQUEST.md` (Entry 2026-10-09T03:47:34Z: R1, R2, R3, R4, Acceptance Criteria)
- `c:\Users\Chidi\Documents\Web Dev Projects\.agents\teamwork\teamwork_preview_orchestrator_3\PROJECT.md` (Architecture, Milestones M0–M5, Interface Contracts)
- `c:\Users\Chidi\Documents\Web Dev Projects\.agents\teamwork\spec_miner_survey_3\report.md` (Sections 1–6)
- Reference Runners: `neurogrid-os/tests/run-e2e-tests.mjs`, `sentinel_agritech/tests/run-e2e-tests.mjs`

---

## 1. Executive Summary & Testing Philosophy

**Synergis AI** is the Autonomous Supply Chain "Control Tower" for Mega-Projects (GovTech + Construction). The system delivers a "Minimalist Industrial" Single Page Application (monochrome carbon black, stark chalk white, construction safety orange `#FF5F15`, precision corner crosshairs, monospace telemetry, and a light/dark mode engine) with scroll-triggered Framer Motion pipelines, exact commercial pricing tiers, single leadership cardinality, zero accelerator mentions, and strict AWS neutrality.

To verify this mission-critical application without facade or tautological tests, the testing track adheres to four core testing tenets:

1. **Requirement-Driven & Opaque-Box**: Tests are derived strictly from authoritative specifications (`ORIGINAL_REQUEST.md`, `PROJECT.md`, `report.md`). Verification evaluates observable DOM structures, CSS token classes, rendered strings, layout constraints, and runtime processes from the outside without coupling to private implementation trivia.
2. **Deterministic & Zero-Dependency Execution**: The test runner is authored as a pure Node.js ES Module utilizing native libraries (`node:fs`, `node:path`, `node:url`, `node:child_process`). It requires **zero external npm test frameworks** (e.g., Jest, Vitest, Playwright, Cypress) and executes deterministically across Windows PowerShell and Unix environments.
3. **Progressive Testability & Cardinality Guardrails**: Tests measure both baseline scaffolding and progressive milestone delivery. Strict negative constraints (e.g., zero accelerator references, zero proprietary AWS services, exact single founder profile, exact single business email, exact single phone number) are enforced with mathematical precision.
4. **4-Tier Test Case Hierarchy**: Test coverage is structured into 4 distinct verification tiers spanning 81 discrete assertions.

---

## 2. 4-Tier Test Suite Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ SYNERGIS AI: 4-TIER E2E TEST RUNNER ARCHITECTURE                                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  TIER 1: FEATURE COVERAGE (60 Assertions)                                              │
│  ▶ ≥5 tests per feature across 12 core functional domains                             │
│    F1. Single-Page Sequencing (5)      F7. How It Works Pipeline (5)                  │
│    F2. Theming & Dual-Mode Engine (5)  F8. Pricing Matrix & Billing Toggle (5)        │
│    F3. Brand Logo & Favicon Mark (5)   F9. About Us & Single Founder Bio (5)          │
│    F4. Floating Industrial Navbar (5)  F10. Contact Us & RFP Intake Form (5)          │
│    F5. Mobile Drawer Navigation (5)    F11. AWS Neutrality & Open Standards (5)       │
│    F6. Hero Section & HUD Telemetry (5) F12. Viewport Fluid Responsiveness (5)        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  TIER 2: BOUNDARY & CORNER CASES (10 Assertions)                                       │
│  ▶ Exact cardinality, negative constraints, viewport extremes, and stress boundaries   │
│    E2E-T2-01: Exactly 1 Founder (Dr. Marcus Vance)     E2E-T2-06: Exactly 3 Pricing Tiers   │
│    E2E-T2-02: Zero Accelerator Mentions (0)           E2E-T2-07: 320px vs 3840px Extremes │
│    E2E-T2-03: Exactly 1 Business Email (tower@...)    E2E-T2-08: Rapid Theme Switch Stress│
│    E2E-T2-04: Exactly 1 Phone (+1 (800) 584-3921)     E2E-T2-09: Empty Form Validation    │
│    E2E-T2-05: Strict AWS Cloud Neutrality (0)         E2E-T2-10: Anchor & scroll-mt Offset│
├────────────────────────────────────────────────────────────────────────────────────────┤
│  TIER 3: CROSS-FEATURE COMBINATIONS (6 Assertions)                                     │
│  ▶ Multi-system concurrent interactions and isomorphic lifecycle integrity             │
│    E2E-T3-01: Theme Persistence Across All 5 Sections                                 │
│    E2E-T3-02: Framer Motion Scroll Pipeline & SSR Hydration Safety                    │
│    E2E-T3-03: Pricing Matrix & Interactive Billing Discount Recalculation             │
│    E2E-T3-04: Responsive Reflow & Mobile Drawer Auto-Close on Jump                    │
│    E2E-T3-05: Telemetry HUD & Animation Cohesion (Grid, Crosshairs, Safety Orange)    │
│    E2E-T3-06: Single-Page Hash Routing & Fixed Header Offset (scroll-mt-24)           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  TIER 4: REAL-WORLD MEGA-PROJECT WORKLOAD SCENARIOS (5 Assertions)                     │
│  ▶ Full end-to-end user journeys and production compilation validation                │
│    E2E-T4-01: User Journey 1: Mega-Project Executive Conversion Funnel                │
│    E2E-T4-02: User Journey 2: Supply Chain Disruption & Rerouting Walkthrough         │
│    E2E-T4-03: User Journey 3: GovTech Enterprise RFP Consultation Submission          │
│    E2E-T4-04: User Journey 4: Deterministic Production Build Compilation (npm build)  │
│    E2E-T4-05: User Journey 5: Asset Resolution & Favicon Header Verification          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Test Execution Harness Specifications

### 3.1 Runner Parameters
- **Runner File**: `c:\Users\Chidi\Documents\Web Dev Projects\synergis-ai\tests\run-e2e-tests.mjs`
- **Execution Syntax**:
  ```powershell
  # Run entire 4-tier suite (all 81 tests)
  node tests/run-e2e-tests.mjs --tier=all

  # Run specific tier
  node tests/run-e2e-tests.mjs --tier=1
  node tests/run-e2e-tests.mjs --tier=2
  node tests/run-e2e-tests.mjs --tier=3
  node tests/run-e2e-tests.mjs --tier=4
  ```
- **CLI Options**:
  - `--tier=1` | `--tier=2` | `--tier=3` | `--tier=4` | `--tier=all`
  - `-h`, `--help` displays help documentation
- **Runtime Target**: Node.js v20+ / v24+ on Windows PowerShell / CMD / POSIX shells
- **Exit Codes**:
  - `0`: All executed test assertions passed with 100% success.
  - `1`: One or more test assertions failed (emits granular failure breakdown with expected, observed, and file paths).

### 3.2 Verification Engines within the Runner
1. **Component & File Resolver (`findFirstExistingFile`)**: Intelligently resolves both modular section components (e.g., `src/components/sections/Hero.tsx`, `Navbar.tsx`, etc.) and single-page monolithic scaffolds (`src/app/page.tsx`), concatenating re-exports transparently.
2. **DOM Section Boundary Extractor (`extractSectionContent`)**: Parses individual `<section id="...">...</section>` blocks to prevent cross-section assertion pollution.
3. **Recursive Codebase Scanner (`getAllFiles`)**: Traverses source directories while strictly skipping `node_modules`, `.next`, `tests`, and `.git`.
4. **Negative Pattern & Lexical Scanner**: Strips comments and placeholder attributes before executing strict boundary regexes (preventing false positives from comments or input placeholders).
5. **Compilation Subprocess Runner**: Executes Windows-compatible `npm.cmd run build` within a sandboxed child process, capturing build output, execution timing, and exit status.

---

## 4. Tier 1: Feature Coverage Inventory (60 Tests)

### Feature 1: Single-Page Architecture & 5-Section Sequencing
- **E2E-T1-F1-01**: `src/app/page.tsx` exists and exports valid Next.js root single-page container.
- **E2E-T1-F1-02**: All 5 required section IDs (`home`, `how-it-works`, `pricing`, `about`, `contact`) are declared in the DOM.
- **E2E-T1-F1-03**: Section declaration order strictly matches: `idx(home) < idx(how-it-works) < idx(pricing) < idx(about) < idx(contact)`.
- **E2E-T1-F1-04**: All 5 sections include scroll margin offset (`scroll-mt-24`) to clear fixed navbar occlusion.
- **E2E-T1-F1-05**: Page component renders isomorphically without SSR-breaking global `window` / `document` access.

### Feature 2: Minimalist Industrial Theme & Dual-Mode Engine
- **E2E-T1-F2-01**: ThemeProvider component integrates `next-themes` provider.
- **E2E-T1-F2-02**: ThemeProvider configures `attribute="class"` for Tailwind dark mode class injection.
- **E2E-T1-F2-03**: ThemeProvider specifies `defaultTheme="dark"` (Industrial Night Shift default).
- **E2E-T1-F2-04**: Tailwind configuration enables class-based dark mode (`darkMode: ["class"]`).
- **E2E-T1-F2-05**: ThemeToggle implements interactive `useTheme` toggle with mounted hydration guard and Sun/Moon icons.

### Feature 3: Brand Identity, Logo Mark & Favicon Assets
- **E2E-T1-F3-01**: Brand favicon asset exists in `public/` (`favicon.ico` and/or `favicon.svg`).
- **E2E-T1-F3-02**: Favicon asset byte size is greater than 50 bytes (non-empty binary/vector).
- **E2E-T1-F3-03**: Next.js RootLayout metadata configures `icons` referencing brand favicon.
- **E2E-T1-F3-04**: BrandLogo renders custom geometric vector SVG emblem.
- **E2E-T1-F3-05**: BrandLogo incorporates Minimalist Industrial styling with Safety Construction Orange accent (`#FF5F15`).

### Feature 4: Floating Industrial Navbar & Smooth Anchors
- **E2E-T1-F4-01**: Navbar header element exists and is present in page layout.
- **E2E-T1-F4-02**: Navbar provides smooth anchor links to all 5 sections (`#home`, `#how-it-works`, `#pricing`, `#about`, `#contact`).
- **E2E-T1-F4-03**: Navbar styles include fixed/sticky top positioning and backdrop blur (`backdrop-blur-md`).
- **E2E-T1-F4-04**: Navbar includes high-visibility primary CTA button linking to `#contact` or `#pricing`.
- **E2E-T1-F4-05**: Navbar integrates ThemeToggle component for accessible dual-mode control.

### Feature 5: Mobile Navigation Drawer & Hamburger Controls
- **E2E-T1-F5-01**: Navbar or MobileMenu implements reactive mobile drawer state (`isOpen` / `setIsOpen`).
- **E2E-T1-F5-02**: Hamburger toggle button provides accessible ARIA attributes (`aria-label` or `aria-expanded`).
- **E2E-T1-F5-03**: Mobile hamburger control alternates between open (`Menu`) and close (`X`) icons.
- **E2E-T1-F5-04**: Mobile navigation drawer utilizes responsive hiding utility classes (`md:hidden` or `lg:hidden`).
- **E2E-T1-F5-05**: Mobile drawer navigation links trigger auto-close handler (`setIsOpen(false)`) on link selection.

### Feature 6: Section 1: Home (Hero Banner, HUD Metrics, CTAs)
- **E2E-T1-F6-01**: Hero section features high-impact headline introducing Autonomous Supply Chain Control Tower for Mega-Projects.
- **E2E-T1-F6-02**: Hero section renders industrial live status beacon pill (`[CONTROL TOWER: SYNCHRONIZED]` or `ONLINE`).
- **E2E-T1-F6-03**: Hero section contains primary conversion CTA button linking to `#contact` or `#pricing`.
- **E2E-T1-F6-04**: Hero section contains secondary exploration CTA button linking to `#how-it-works`.
- **E2E-T1-F6-05**: Hero section renders industrial telemetry HUD metric cards (Monitored CapEx, On-Time Dispatch, Solver Latency).

### Feature 7: Section 2: How It Works (Scroll Storytelling, Nodes, Line Drawing)
- **E2E-T1-F7-01**: How It Works pipeline is client-rendered with `"use client"` directive for animation hooks.
- **E2E-T1-F7-02**: How It Works section imports and employs Framer Motion for scroll-driven animations.
- **E2E-T1-F7-03**: Pipeline defines 4 distinct supply chain nodes (Procurement, GovTech, Logistics, Autonomous Mitigation).
- **E2E-T1-F7-04**: Section features SVG path conduit lines connecting nodes (`motion.path` with `pathLength` / `strokeDashoffset`).
- **E2E-T1-F7-05**: Section incorporates stage sequence identifiers or autonomous disruption mitigation simulation.

### Feature 8: Section 3: Pricing Matrix & Interactive Billing Switch
- **E2E-T1-F8-01**: Pricing section renders exactly 3 named tiers (`Site Core`, `Enterprise Tower`, `Sovereign Infrastructure`).
- **E2E-T1-F8-02**: Tiers reflect realistic mega-project CapEx scope ($4,800/mo, $14,500/mo, custom sovereign enterprise).
- **E2E-T1-F8-03**: Pricing section includes interactive billing frequency switch (Monthly vs Annual toggle).
- **E2E-T1-F8-04**: Annual billing frequency displays commitment discount badge (15–20% savings).
- **E2E-T1-F8-05**: Each pricing tier features distinct feature checklist items and dedicated CTA buttons.

### Feature 9: Section 4: About Us (Mission Statement & Single Founder Bio)
- **E2E-T1-F9-01**: About Us section contains clear mega-project infrastructure mission statement.
- **E2E-T1-F9-02**: About Us section contains dedicated placeholder for founder portrait / avatar image.
- **E2E-T1-F9-03**: Founder biography highlights civil engineering and mega-project optimization credentials (Dr. Marcus Vance).
- **E2E-T1-F9-04**: About Us section contains zero secondary co-founders, advisory boards, or team profile arrays.
- **E2E-T1-F9-05**: About Us section copy is completely free of startup accelerator or incubator mentions.

### Feature 10: Section 5: Contact Us & Enterprise RFP Inquiry Form
- **E2E-T1-F10-01**: Contact Us section displays approved official business email placeholder (`tower@synergisai.com`).
- **E2E-T1-F10-02**: Contact Us section displays approved operations dispatch telephone number (`+1 (800) 584-3921`).
- **E2E-T1-F10-03**: Section renders comprehensive enterprise RFP intake form (Name, Work Email, Project CapEx, Scope).
- **E2E-T1-F10-04**: Inquiry form features submission handler (`onSubmit`) and dedicated dispatch button.
- **E2E-T1-F10-05**: Form provides feedback state upon transmission (confirmation badge, alert, or queued status).

### Feature 11: Brand & Cloud Neutrality (AWS Minimization)
- **E2E-T1-F11-01**: Zero promotional occurrences of AWS in application code and user copy.
- **E2E-T1-F11-02**: Zero occurrences of "Amazon Web Services" across all source files.
- **E2E-T1-F11-03**: Zero occurrences of proprietary cloud infrastructure primitives (`S3`, `EC2`, `Lambda`).
- **E2E-T1-F11-04**: Zero occurrences of proprietary AWS ML & database services (`SageMaker`, `DynamoDB`, `CloudWatch`).
- **E2E-T1-F11-05**: Technical copy emphasizes vendor-neutral standards (BIM LOD 400, IFC, MILP solvers, ERP ingestion).

### Feature 12: Viewport Responsiveness & Industrial Grid Layout
- **E2E-T1-F12-01**: Layout containers implement responsive flex stacking (`flex-col sm:flex-row` / `md:flex-row`).
- **E2E-T1-F12-02**: Grid containers employ responsive column utilities (`grid-cols-1 md:grid-cols-3` / `grid-cols-2 md:grid-cols-4`).
- **E2E-T1-F12-03**: Main containers provide responsive horizontal gutter padding (`px-4 sm:px-6 lg:px-8`).
- **E2E-T1-F12-04**: Content width is bounded by `max-w-7xl` containers and centered with `mx-auto`.
- **E2E-T1-F12-05**: Headings and body typography utilize responsive sizing utilities (`text-4xl sm:text-6xl`).

---

## 5. Tier 2: Boundary & Corner Cases (10 Tests)

| Test ID | Boundary Scope | Verification Method | Expected Observable Condition |
|:---|:---|:---|:---|
| **E2E-T2-01** | Exact Founder Cardinality | Regex scan on About Us component for founder names, co-founders, and executive titles. | Exactly 1 founder profile (`Dr. Marcus Vance`), 0 co-founders, 0 secondary bios. |
| **E2E-T2-02** | Zero Accelerators | Case-insensitive regex scan across `src/` and `public/` for Y Combinator, Techstars, accelerators, incubators. | Exactly 0 matches across the entire codebase. |
| **E2E-T2-03** | Exact Email Cardinality | Extraction of published email addresses in Contact Us section. | Exactly 1 unique email placeholder: `tower@synergisai.com`. |
| **E2E-T2-04** | Exact Phone Cardinality | Extraction and normalization of telephone numbers in Contact Us. | Exactly 1 unique normalized phone number: `+1 (800) 584-3921`. |
| **E2E-T2-05** | Strict AWS Neutrality | Recursive scan of all source files for AWS, S3, EC2, Lambda, SageMaker, DynamoDB. | Exactly 0 matches across all source files. |
| **E2E-T2-06** | Pricing Tiers Exactness | Extraction of distinct pricing tier cards and tier headers. | Exactly 3 named tiers (`Site Core`, `Enterprise Tower`, `Sovereign Infrastructure`). |
| **E2E-T2-07** | Viewport Extremes | Inspection of single-column mobile collapse and `max-w-7xl mx-auto` constraints. | Fluid reflow at 320px; centered bounding at 3840px. |
| **E2E-T2-08** | Rapid Theme Toggling Stress | Inspection of paired `dark:` and light utility classes and `#FF5F15` accent. | High visual contrast maintained in both modes without unstyled flashes. |
| **E2E-T2-09** | Empty Form Submission Boundary | Inspection of `required` attributes on input and textarea controls. | At least 2 required field attributes preventing blank form dispatches. |
| **E2E-T2-10** | Anchor Hash Integrity & Offset | 1:1 match between navbar anchor targets and section container IDs with `scroll-mt-24`. | Seamless anchor jumping without fixed header occlusion. |

---

## 6. Tier 3: Cross-Feature Combinations (6 Tests)

| Test ID | Cross-Feature Interaction | Verification Method | Expected Observable Condition |
|:---|:---|:---|:---|
| **E2E-T3-01** | Theming Persistence Across All 5 Sections | Inspect all 5 section containers for paired light/dark classes and `#FF5F15` accents. | Clean visual contrast in both dark and light modes across all sections. |
| **E2E-T3-02** | Framer Motion Pipeline & SSR Lifecycle | Inspect `"use client"` directive, Framer Motion imports, and absence of top-level `window` calls. | Isomorphic SSR hydration safety guaranteed during build and runtime. |
| **E2E-T3-03** | Pricing Matrix & Interactive Billing Switch | Validate state hook (`isAnnual`), 15–20% discount formula, and rate updates. | Switching toggle updates pricing and cadence labels across all 3 tiers synchronously. |
| **E2E-T3-04** | Responsive Reflow & Mobile Drawer Flow | Inspect mobile menu state hook, `md:hidden` hiding, and `setIsOpen(false)` on link selection. | Mobile menu opens on small screens, auto-closes on section selection, concealed on desktop. |
| **E2E-T3-05** | Telemetry HUD & Animation Cohesion | Inspect technical grid backgrounds, corner crosshairs (`+`), monospace telemetry, and orange accents. | Cohesive Minimalist Industrial styling across HUD cards and pipeline nodes. |
| **E2E-T3-06** | Single-Page Hash Routing & Fixed Header Offset | Compare sticky/fixed header height against `scroll-mt-24` margin on all sections. | Smooth scrolling reaches section titles cleanly without header obscuring text. |

---

## 7. Tier 4: Real-World Scenarios (5 Tests)

| Test ID | Scenario Description | Verification Method | Expected Observable Condition |
|:---|:---|:---|:---|
| **E2E-T4-01** | User Journey 1: Mega-Project Executive Conversion Funnel | Trace anchor pathways from Hero CTAs -> Pricing Cards -> Contact Us intake. | Unbroken conversion pathway from landing banner to RFP consultation. |
| **E2E-T4-02** | User Journey 2: Supply Chain Disruption & Rerouting Walkthrough | Validate 4-stage pipeline (Procurement -> GovTech -> Telemetry -> Mitigation) with < 140ms solver latency. | Interactive storytelling simulates disruption and highlights autonomous rerouting. |
| **E2E-T4-03** | User Journey 3: GovTech Enterprise RFP Consultation Submission | Inspect interactive form controls (Name, Work Email, CapEx Tier, Requirements) and feedback state. | Interactive form captures prime contractor data and displays transmission acknowledgement. |
| **E2E-T4-04** | User Journey 4: Deterministic Production Build Compilation | Execute `npm.cmd run build` via child process with 180s timeout. | Build exits with code 0; `.next/` production bundle generated without errors. |
| **E2E-T4-05** | User Journey 5: Asset Resolution & Favicon Header Verification | Validate existence, byte size (> 50B), and metadata linkage of favicon assets. | Browser tab renders brand favicon correctly with HTTP 200 resolution. |

---

## 8. Defect Escalation & Reporting Protocol

If an E2E test assertion fails during execution:
1. **Defect Classification**:
   - *Test Code Defect*: Test runner contains invalid regular expression or faulty path assumptions -> Fix test runner directly within the testing track.
   - *Implementation Defect*: Application violates specifications, cardinality bounds, or build contracts -> **Do NOT modify implementation code**. Escalate the exact defect with file path, line number, expected vs. observed output to the implementing agent and orchestrator.
2. **Standard Output Diagnostics**:
   Each test failure emits explicit diagnostics:
   ```
   ✖ FAIL [Test ID] Test Name
          Expected: <Expected specification state>
          Observed: <Actual observed output>
          File: <Path to file inspected>
   ```
3. **Completion Gate**:
   Prior to project handover, `node tests/run-e2e-tests.mjs --tier=all` must achieve 100% pass (0 failures) and `npm.cmd run build` must complete with exit code 0.
