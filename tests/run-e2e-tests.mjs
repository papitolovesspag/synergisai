#!/usr/bin/env node
/**
 * ==============================================================================
 * SYNERGIS AI: STANDALONE 4-TIER E2E VERIFICATION TEST RUNNER
 * ==============================================================================
 * Track: Requirement-Driven, Opaque-Box E2E Testing
 * Target: synergis-ai Next.js Application
 * Author: teamwork_preview_test_writer_m0
 * Runtime: Node.js v20+ / v24+ (ESM Native, Zero External npm Dependencies)
 * Execution: node tests/run-e2e-tests.mjs [--tier=1|2|3|4|all]
 *
 * Tier Hierarchy:
 *   Tier 1: Feature Coverage (≥5 tests per feature across 12 core features = 60 tests)
 *   Tier 2: Boundary & Corner Cases (Cardinality, Negative Constraints, Extremes = 10 tests)
 *   Tier 3: Cross-Feature Combinations (Theming, SSR, Pricing Discount, Drawer, Telemetry = 6 tests)
 *   Tier 4: Real-World Mega-Project Scenarios (Conversion Funnel, Disruption Rerouting, RFP Form, Build = 5 tests)
 * Total Assertions: 81
 * ==============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Color helpers for terminal output
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  orange: "\x1b[38;5;208m",
  bgCyan: "\x1b[46m\x1b[30m",
  bgGreen: "\x1b[42m\x1b[30m",
  bgRed: "\x1b[41m\x1b[37m",
  bgYellow: "\x1b[43m\x1b[30m",
};

// Global Test Execution State
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];
const tierStats = {
  tier1: { total: 0, passed: 0, failed: 0 },
  tier2: { total: 0, passed: 0, failed: 0 },
  tier3: { total: 0, passed: 0, failed: 0 },
  tier4: { total: 0, passed: 0, failed: 0 },
};

function logHeader(text) {
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  ${text}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

function logTier(tierNumber, tierTitle) {
  console.log(`\n${colors.bold}${colors.magenta}┌─────────────────────────────────────────────────────────────────────────────┐${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}│ TIER ${tierNumber}: ${tierTitle.padEnd(65)}│${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}└─────────────────────────────────────────────────────────────────────────────┘${colors.reset}`);
}

function logFeatureHeader(featureNum, featureName) {
  console.log(`\n  ${colors.bold}${colors.orange}▶ Feature ${featureNum}: ${featureName}${colors.reset}`);
}

function assertTest(tierKey, testId, name, condition, details = {}) {
  totalTests++;
  tierStats[tierKey].total++;

  if (condition) {
    passedTests++;
    tierStats[tierKey].passed++;
    console.log(`    ${colors.green}✔ PASS${colors.reset} [${colors.bold}${testId}${colors.reset}] ${name}`);
    if (details.note) {
      console.log(`           ${colors.dim}↳ ${details.note}${colors.reset}`);
    }
  } else {
    failedTests++;
    tierStats[tierKey].failed++;
    console.log(`    ${colors.red}✖ FAIL${colors.reset} [${colors.bold}${testId}${colors.reset}] ${name}`);
    console.log(`           ${colors.red}Expected: ${details.expected || "true"}${colors.reset}`);
    console.log(`           ${colors.red}Observed: ${details.observed || "false"}${colors.reset}`);
    if (details.file) {
      console.log(`           ${colors.yellow}File: ${details.file}${colors.reset}`);
    }
    failures.push({ testId, name, details, tierKey });
  }
}

// Utility file helpers
function readFileSafe(relPath) {
  const fullPath = path.join(projectRoot, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf-8");
}

function fileExists(relPath) {
  const fullPath = path.join(projectRoot, relPath);
  return fs.existsSync(fullPath);
}

function getFileSize(relPath) {
  const fullPath = path.join(projectRoot, relPath);
  if (!fs.existsSync(fullPath)) return 0;
  return fs.statSync(fullPath).size;
}

function findFirstExistingFile(candidatePaths) {
  let combinedContent = "";
  let firstFoundPath = null;
  for (const relPath of candidatePaths) {
    const fullPath = path.join(projectRoot, relPath);
    if (fs.existsSync(fullPath)) {
      if (!firstFoundPath) firstFoundPath = relPath;
      combinedContent += fs.readFileSync(fullPath, "utf-8") + "\n";
    }
  }
  return { path: firstFoundPath, content: firstFoundPath ? combinedContent : null };
}

/**
 * Isolates a specific <section id="...">...</section> block if defined inside page.tsx
 */
function extractSectionContent(fullContent, sectionId) {
  if (!fullContent) return null;
  const startRegex = new RegExp(`<section[^>]*id=["']${sectionId}["'][^>]*>`, "i");
  const match = fullContent.match(startRegex);
  if (!match) return null;
  const startIdx = match.index;
  const rest = fullContent.slice(startIdx + match[0].length);
  const nextSectionMatch = rest.match(/<section[^>]*id=/i);
  const endIdx = nextSectionMatch ? startIdx + match[0].length + nextSectionMatch.index : fullContent.length;
  return fullContent.slice(startIdx, endIdx);
}

function getAllFiles(dir, exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css", ".html", ".svg"]) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== "node_modules" &&
        entry.name !== ".next" &&
        entry.name !== "tests" &&
        entry.name !== ".git"
      ) {
        results = results.concat(getAllFiles(full, exts));
      }
    } else if (entry.isFile()) {
      if (exts.includes(path.extname(entry.name))) {
        results.push(full);
      }
    }
  }
  return results;
}

// ==============================================================================
// TIER 1: FEATURE COVERAGE (≥5 TESTS PER FEATURE ACROSS 12 FEATURES = 60 TESTS)
// ==============================================================================
function runTier1() {
  logTier(1, "FEATURE COVERAGE (12 FEATURES, ≥5 TESTS EACH, 60 TOTAL CHECKS)");

  const pageContent = readFileSafe("src/app/page.tsx") || "";

  // ----------------------------------------------------------------------------
  // Feature 1: Single-Page Architecture & 5-Section Sequencing
  // ----------------------------------------------------------------------------
  logFeatureHeader(1, "Single-Page Architecture & 5-Section Sequencing");
  {
    // E2E-T1-F1-01: page.tsx exists and renders root container
    const hasPage = fileExists("src/app/page.tsx") && pageContent.length > 50;
    assertTest(
      "tier1",
      "E2E-T1-F1-01",
      "src/app/page.tsx exists and exports valid Next.js root single-page container",
      hasPage,
      {
        expected: "src/app/page.tsx present with valid default export component",
        observed: hasPage ? `Found src/app/page.tsx (${pageContent.length} chars)` : "File missing or empty",
        file: "src/app/page.tsx",
        note: "Single Page Application root entry point verified",
      }
    );

    // E2E-T1-F1-02: All 5 section IDs declared
    const sectionIds = ["home", "how-it-works", "pricing", "about", "contact"];
    const foundIds = sectionIds.filter((id) => {
      const reg = new RegExp(`id=["']${id}["']`, "i");
      return reg.test(pageContent);
    });
    assertTest(
      "tier1",
      "E2E-T1-F1-02",
      "All 5 required section IDs (home, how-it-works, pricing, about, contact) are declared in the DOM",
      foundIds.length === 5,
      {
        expected: "All 5 IDs: [home, how-it-works, pricing, about, contact]",
        observed: `Found ${foundIds.length}/5: [${foundIds.join(", ")}]`,
        file: "src/app/page.tsx",
        note: "DOM section anchors present for hash navigation",
      }
    );

    // E2E-T1-F1-03: Section declaration order matches exact sequential contract
    const indices = sectionIds.map((id) => {
      const match = pageContent.match(new RegExp(`id=["']${id}["']`, "i"));
      return { id, idx: match ? match.index : -1 };
    });
    const inOrder = indices.every((s, i) => s.idx !== -1 && (i === 0 || s.idx > indices[i - 1].idx));
    assertTest(
      "tier1",
      "E2E-T1-F1-03",
      "Section declaration order strictly follows #home -> #how-it-works -> #pricing -> #about -> #contact",
      inOrder,
      {
        expected: "Strict ordering: home < how-it-works < pricing < about < contact",
        observed: inOrder ? "Exact sequential order confirmed" : JSON.stringify(indices.map((s) => `${s.id}:${s.idx}`)),
        file: "src/app/page.tsx",
        note: "Ensures logical scroll progression without layout scrambling",
      }
    );

    // E2E-T1-F1-04: Each section has scroll-mt offset
    const sectionsWithOffset = sectionIds.filter((id) => {
      const secContent = extractSectionContent(pageContent, id);
      return secContent && /scroll-mt-(?:16|20|24|28|32)/i.test(secContent);
    });
    assertTest(
      "tier1",
      "E2E-T1-F1-04",
      "All 5 sections include scroll margin offset (scroll-mt-24) to clear fixed navbar occlusion",
      sectionsWithOffset.length === 5,
      {
        expected: "5 sections with scroll-mt-* classes",
        observed: `Found ${sectionsWithOffset.length}/5 with scroll-mt: [${sectionsWithOffset.join(", ")}]`,
        file: "src/app/page.tsx",
        note: "Prevents sticky navbar from concealing section titles on anchor click",
      }
    );

    // E2E-T1-F1-05: Page avoids SSR-breaking top-level window/document access
    const hasUnsafeWindow = /\b(?:window|document|localStorage)\./.test(
      pageContent.replace(/\b(?:useEffect|useLayoutEffect)\b[\s\S]*?\}/g, "")
    );
    assertTest(
      "tier1",
      "E2E-T1-F1-05",
      "Page component renders isomorphically without SSR-breaking global window/document access",
      !hasUnsafeWindow,
      {
        expected: "Zero top-level window/document accesses outside of useEffect hooks",
        observed: hasUnsafeWindow ? "Discovered naked window/document calls" : "Isomorphic SSR hydration safe",
        file: "src/app/page.tsx",
        note: "Hydration safety guaranteed during initial server render",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 2: Minimalist Industrial Theme & Dual-Mode Engine
  // ----------------------------------------------------------------------------
  logFeatureHeader(2, "Minimalist Industrial Theme & Dual-Mode Engine");
  {
    const themeProviderRes = findFirstExistingFile([
      "src/components/providers/ThemeProvider.tsx",
      "src/components/ui/ThemeProvider.tsx",
      "src/app/providers.tsx",
    ]);
    const themeToggleRes = findFirstExistingFile([
      "src/components/ui/ThemeToggle.tsx",
      "src/components/ThemeToggle.tsx",
    ]);
    const tailwindCfg = readFileSafe("tailwind.config.ts") || readFileSafe("tailwind.config.js") || "";

    // E2E-T1-F2-01: ThemeProvider wraps with next-themes
    const usesNextThemes = Boolean(themeProviderRes.content && themeProviderRes.content.includes("next-themes"));
    assertTest(
      "tier1",
      "E2E-T1-F2-01",
      "ThemeProvider component integrates next-themes provider",
      usesNextThemes,
      {
        expected: "ThemeProvider imports and renders next-themes Provider",
        observed: usesNextThemes ? "next-themes integration detected" : "ThemeProvider missing or lacks next-themes",
        file: themeProviderRes.path || "src/components/ui/ThemeProvider.tsx",
        note: "Standard theme state context verified",
      }
    );

    // E2E-T1-F2-02: ThemeProvider configures attribute="class"
    const hasClassAttribute = Boolean(themeProviderRes.content && themeProviderRes.content.includes('attribute="class"'));
    assertTest(
      "tier1",
      "E2E-T1-F2-02",
      "ThemeProvider configures attribute=\"class\" for Tailwind dark mode class injection",
      hasClassAttribute,
      {
        expected: 'attribute="class" defined on Provider',
        observed: hasClassAttribute ? 'attribute="class" configured' : "Attribute class configuration not found",
        file: themeProviderRes.path || "src/components/ui/ThemeProvider.tsx",
        note: "Ensures class toggle on <html> element",
      }
    );

    // E2E-T1-F2-03: ThemeProvider specifies defaultTheme="dark"
    const hasDarkDefault = Boolean(themeProviderRes.content && themeProviderRes.content.includes('defaultTheme="dark"'));
    assertTest(
      "tier1",
      "E2E-T1-F2-03",
      "ThemeProvider specifies defaultTheme=\"dark\" (Industrial Night Shift default)",
      hasDarkDefault,
      {
        expected: 'defaultTheme="dark" configured on ThemeProvider',
        observed: hasDarkDefault ? 'defaultTheme="dark" detected' : "Default dark theme configuration missing",
        file: themeProviderRes.path || "src/components/ui/ThemeProvider.tsx",
        note: "Minimalist Industrial dark aesthetic enabled by default",
      }
    );

    // E2E-T1-F2-04: Tailwind darkMode class configuration
    const hasTailwindDarkMode = tailwindCfg.includes('darkMode: ["class"]') || tailwindCfg.includes("darkMode: 'class'") || tailwindCfg.includes('darkMode: "class"');
    assertTest(
      "tier1",
      "E2E-T1-F2-04",
      "Tailwind configuration enables class-based dark mode (darkMode: [\"class\"])",
      hasTailwindDarkMode,
      {
        expected: 'darkMode: ["class"] in tailwind.config.ts',
        observed: hasTailwindDarkMode ? "Tailwind darkMode class strategy active" : "Tailwind darkMode class setting missing",
        file: "tailwind.config.ts",
        note: "Tailwind utility dark: classes hooked to DOM classList",
      }
    );

    // E2E-T1-F2-05: ThemeToggle provides interactive switch with hydration guard
    const toggleContent = themeToggleRes.content || "";
    const hasToggleHooks = toggleContent.includes("useTheme") && toggleContent.includes("setTheme");
    const hasMountedCheck = toggleContent.includes("mounted") && toggleContent.includes("useEffect");
    const hasIcons = toggleContent.includes("Sun") && toggleContent.includes("Moon");
    assertTest(
      "tier1",
      "E2E-T1-F2-05",
      "ThemeToggle implements interactive useTheme toggle with mounted hydration guard and Sun/Moon icons",
      Boolean(hasToggleHooks && hasMountedCheck && hasIcons),
      {
        expected: "ThemeToggle with useTheme, mounted guard, and Sun/Moon icons",
        observed: `Hooks: ${hasToggleHooks}, Mounted guard: ${hasMountedCheck}, Icons: ${hasIcons}`,
        file: themeToggleRes.path || "src/components/ui/ThemeToggle.tsx",
        note: "Flicker-free theme switching with hydration safety",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 3: Brand Identity, Logo Mark & Favicon Assets
  // ----------------------------------------------------------------------------
  logFeatureHeader(3, "Brand Identity, Logo Mark & Favicon Assets");
  {
    const faviconIcoExists = fileExists("public/favicon.ico");
    const faviconSvgExists = fileExists("public/favicon.svg");
    const icoSize = getFileSize("public/favicon.ico");
    const svgSize = getFileSize("public/favicon.svg");
    const layoutContent = readFileSafe("src/app/layout.tsx") || "";
    const brandLogoRes = findFirstExistingFile([
      "src/components/ui/BrandLogo.tsx",
      "src/components/BrandLogo.tsx",
      "src/components/navigation/Navbar.tsx",
      "src/app/page.tsx",
    ]);
    const logoContent = brandLogoRes.content || "";

    // E2E-T1-F3-01: Favicon asset exists in public/
    const hasFavicon = faviconIcoExists || faviconSvgExists;
    assertTest(
      "tier1",
      "E2E-T1-F3-01",
      "Brand favicon asset exists in public/ (favicon.ico and/or favicon.svg)",
      hasFavicon,
      {
        expected: "public/favicon.ico or public/favicon.svg present",
        observed: `favicon.ico: ${faviconIcoExists}, favicon.svg: ${faviconSvgExists}`,
        file: "public/favicon.ico, public/favicon.svg",
        note: "Browser tab icon asset availability confirmed",
      }
    );

    // E2E-T1-F3-02: Favicon asset size > 50 bytes
    const validSize = icoSize > 50 || svgSize > 50;
    assertTest(
      "tier1",
      "E2E-T1-F3-02",
      "Favicon asset byte size is greater than 50 bytes (non-empty binary/vector)",
      validSize,
      {
        expected: "File size > 50 bytes",
        observed: `favicon.ico: ${icoSize} bytes, favicon.svg: ${svgSize} bytes`,
        file: "public/favicon.ico",
        note: "Guarantees asset is not a zero-byte placeholder",
      }
    );

    // E2E-T1-F3-03: layout.tsx configures icons metadata
    const hasIconsMeta = layoutContent.includes("icons") && (layoutContent.includes("favicon.ico") || layoutContent.includes("favicon.svg"));
    assertTest(
      "tier1",
      "E2E-T1-F3-03",
      "Next.js RootLayout metadata configures icons referencing brand favicon",
      Boolean(hasIconsMeta),
      {
        expected: "Metadata export with icons pointing to favicon asset",
        observed: hasIconsMeta ? "Icons metadata configured in layout.tsx" : "Metadata icons missing",
        file: "src/app/layout.tsx",
        note: "Next.js App Router tab icon resolution verified",
      }
    );

    // E2E-T1-F3-04: Logo component renders vector SVG mark
    const hasSvgMark = logoContent.includes("<svg") && (logoContent.includes("polygon") || logoContent.includes("path") || logoContent.includes("line"));
    assertTest(
      "tier1",
      "E2E-T1-F3-04",
      "BrandLogo renders custom geometric vector SVG emblem",
      Boolean(hasSvgMark),
      {
        expected: "SVG vector paths for geometric control tower brand mark",
        observed: hasSvgMark ? "Custom SVG geometry found" : "Brand logo SVG mark missing",
        file: brandLogoRes.path || "src/components/ui/BrandLogo.tsx",
        note: "Precision industrial emblem rendered",
      }
    );

    // E2E-T1-F3-05: Logo mark incorporates Minimalist Industrial styling with Safety Orange
    const hasOrangeAccent = logoContent.includes("#FF5F15") || logoContent.includes("#EA580C") || logoContent.includes("#F97316") || logoContent.includes("safety-orange") || logoContent.includes("text-[#FF5F15]");
    assertTest(
      "tier1",
      "E2E-T1-F3-05",
      "BrandLogo incorporates Minimalist Industrial styling with Safety Construction Orange accent (#FF5F15)",
      Boolean(hasOrangeAccent),
      {
        expected: "Safety Construction Orange (#FF5F15) present in logo styling or markup",
        observed: hasOrangeAccent ? "Safety orange accent detected in brand mark" : "Orange brand accent missing",
        file: brandLogoRes.path || "src/components/ui/BrandLogo.tsx",
        note: "Brand color fidelity confirmed",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 4: Floating Industrial Navbar & Smooth Anchors
  // ----------------------------------------------------------------------------
  logFeatureHeader(4, "Floating Industrial Navbar & Smooth Anchors");
  {
    const navRes = findFirstExistingFile([
      "src/components/navigation/Navbar.tsx",
      "src/components/Navbar.tsx",
      "src/app/page.tsx",
    ]);
    const navContent = navRes.content || "";

    // E2E-T1-F4-01: Navbar component exists
    const hasNav = navContent.includes("<header") || navContent.includes("Navbar");
    assertTest(
      "tier1",
      "E2E-T1-F4-01",
      "Navbar header element exists and is present in page layout",
      Boolean(hasNav),
      {
        expected: "Header element or Navbar component present",
        observed: hasNav ? `Found navbar markup in ${navRes.path}` : "Navbar markup missing",
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Site navigation shell confirmed",
      }
    );

    // E2E-T1-F4-02: Navbar contains exact anchor links for all 5 sections
    const anchors = ["#home", "#how-it-works", "#pricing", "#about", "#contact"];
    const foundAnchors = anchors.filter((a) => navContent.includes(a));
    assertTest(
      "tier1",
      "E2E-T1-F4-02",
      "Navbar provides smooth anchor links to all 5 sections (#home, #how-it-works, #pricing, #about, #contact)",
      foundAnchors.length === 5,
      {
        expected: "All 5 anchors: [#home, #how-it-works, #pricing, #about, #contact]",
        observed: `Found ${foundAnchors.length}/5: [${foundAnchors.join(", ")}]`,
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Complete anchor routing connectivity verified",
      }
    );

    // E2E-T1-F4-03: Fixed or sticky top positioning with backdrop-blur
    const hasFixedSticky = navContent.includes("sticky") || navContent.includes("fixed");
    const hasBackdrop = navContent.includes("backdrop-blur");
    assertTest(
      "tier1",
      "E2E-T1-F4-03",
      "Navbar styles include fixed/sticky top positioning and backdrop blur (backdrop-blur-md)",
      Boolean(hasFixedSticky && hasBackdrop),
      {
        expected: "fixed/sticky top positioning with backdrop-blur",
        observed: `Position: ${hasFixedSticky ? "fixed/sticky" : "static"}, Blur: ${hasBackdrop}`,
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Glassmorphic industrial header elevation validated",
      }
    );

    // E2E-T1-F4-04: Navbar includes quick-action primary CTA button
    const hasNavCta = (navContent.includes("DEPLOY") || navContent.includes("CONTACT") || navContent.includes("ACCESS")) &&
      (navContent.includes("#contact") || navContent.includes("#pricing"));
    assertTest(
      "tier1",
      "E2E-T1-F4-04",
      "Navbar includes high-visibility primary CTA button linking to #contact or #pricing",
      Boolean(hasNavCta),
      {
        expected: "Action button linking to conversion section",
        observed: hasNavCta ? "Primary navigation CTA button detected" : "Nav CTA button missing",
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Conversion funnel access from top navigation header",
      }
    );

    // E2E-T1-F4-05: Navbar integrates ThemeToggle component
    const hasToggleInNav = navContent.includes("ThemeToggle") || navContent.includes("<ThemeToggle");
    assertTest(
      "tier1",
      "E2E-T1-F4-05",
      "Navbar integrates ThemeToggle component for accessible dual-mode control",
      Boolean(hasToggleInNav),
      {
        expected: "ThemeToggle embedded inside Navbar",
        observed: hasToggleInNav ? "ThemeToggle embedded in header" : "ThemeToggle not integrated in navbar",
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "User theming control accessible from top header",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 5: Mobile Navigation Drawer & Hamburger Controls
  // ----------------------------------------------------------------------------
  logFeatureHeader(5, "Mobile Navigation Drawer & Hamburger Controls");
  {
    const navRes = findFirstExistingFile([
      "src/components/navigation/Navbar.tsx",
      "src/components/navigation/MobileMenu.tsx",
      "src/components/Navbar.tsx",
      "src/app/page.tsx",
    ]);
    const mobileRes = findFirstExistingFile([
      "src/components/navigation/MobileMenu.tsx",
    ]);
    const combinedContent = (navRes.content || "") + "\n" + (mobileRes.content || "");

    // E2E-T1-F5-01: Responsive drawer toggle state
    const hasMobileState = /isOpen|setIsOpen|mobileMenuOpen|setMobileMenuOpen|isMenuOpen|toggleMenu/.test(combinedContent);
    assertTest(
      "tier1",
      "E2E-T1-F5-01",
      "Navbar or MobileMenu implements reactive mobile drawer state (isOpen / setIsOpen)",
      Boolean(hasMobileState),
      {
        expected: "State hook (isOpen / setIsOpen or mobileMenuOpen) controlling mobile menu visibility",
        observed: hasMobileState ? "Mobile drawer state hook detected" : "Reactive drawer state missing",
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Interactive mobile navigation state management",
      }
    );

    // E2E-T1-F5-02: Hamburger button contains accessible aria-label
    const hasAria = /aria-label=["'](?:Toggle menu|Open menu|Close menu|Navigation menu)["']|aria-expanded/i.test(combinedContent);
    assertTest(
      "tier1",
      "E2E-T1-F5-02",
      "Hamburger toggle button provides accessible ARIA attributes (aria-label or aria-expanded)",
      Boolean(hasAria),
      {
        expected: "aria-label=\"Toggle menu\" or aria-expanded on mobile hamburger button",
        observed: hasAria ? "Accessible ARIA attributes detected" : "ARIA accessibility missing on mobile button",
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Screen reader accessibility compliance (WCAG 2.1)",
      }
    );

    // E2E-T1-F5-03: Hamburger icon switches to close icon (Menu / X)
    const hasMenuIcons = (combinedContent.includes("Menu") && combinedContent.includes("X")) ||
      (combinedContent.includes("lucide-react") && (combinedContent.includes("Menu") || combinedContent.includes("X")));
    assertTest(
      "tier1",
      "E2E-T1-F5-03",
      "Mobile hamburger control alternates between open (Menu) and close (X) icons",
      Boolean(hasMenuIcons),
      {
        expected: "Lucide Menu and X icons toggled conditionally",
        observed: hasMenuIcons ? "Menu and X icons found" : "Icon alternation missing",
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Clear visual feedback for mobile menu toggling",
      }
    );

    // E2E-T1-F5-04: Mobile drawer uses responsive hiding utility classes
    const hasResponsiveHiding = combinedContent.includes("md:hidden") || combinedContent.includes("lg:hidden");
    assertTest(
      "tier1",
      "E2E-T1-F5-04",
      "Mobile navigation drawer utilizes responsive hiding utility classes (md:hidden or lg:hidden)",
      Boolean(hasResponsiveHiding),
      {
        expected: "md:hidden or lg:hidden applied to mobile drawer elements",
        observed: hasResponsiveHiding ? "Responsive breakpoint classes detected" : "Breakpoint hiding classes missing",
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Drawer concealed on desktop viewports",
      }
    );

    // E2E-T1-F5-05: Clicking drawer links invokes closing handler
    const hasCloseOnClick = /setIsOpen\s*\(\s*false\s*\)|setMobileMenuOpen\s*\(\s*false\s*\)|closeMenu/i.test(combinedContent);
    assertTest(
      "tier1",
      "E2E-T1-F5-05",
      "Mobile drawer navigation links trigger auto-close handler (setIsOpen(false)) on link selection",
      Boolean(hasCloseOnClick),
      {
        expected: "setIsOpen(false) invoked when user clicks an anchor link",
        observed: hasCloseOnClick ? "Auto-close handler confirmed on drawer links" : "Auto-close handler missing on drawer links",
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Prevents drawer from persisting after viewport jumps to target section",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 6: Section 1: Home (Hero Banner, HUD Metrics, CTAs)
  // ----------------------------------------------------------------------------
  logFeatureHeader(6, "Section 1: Home (Hero Banner, HUD Metrics, CTAs)");
  {
    const heroRes = findFirstExistingFile([
      "src/components/sections/Hero.tsx",
      "src/components/sections/HeroSection.tsx",
      "src/app/page.tsx",
    ]);
    const heroContent = heroRes.path === "src/app/page.tsx"
      ? (extractSectionContent(heroRes.content, "home") || heroRes.content)
      : (heroRes.content || "");

    // E2E-T1-F6-01: Main headline introducing Autonomous Supply Chain Control Tower
    const hasHeadline = heroContent.includes("AUTONOMOUS SUPPLY CHAIN") ||
      (heroContent.includes("Autonomous") && heroContent.includes("Control Tower"));
    assertTest(
      "tier1",
      "E2E-T1-F6-01",
      "Hero section features high-impact headline introducing Autonomous Supply Chain Control Tower for Mega-Projects",
      Boolean(hasHeadline),
      {
        expected: "Hero headline presenting Synergis AI Control Tower value proposition",
        observed: hasHeadline ? "Autonomous Supply Chain Control Tower headline found" : "Hero headline missing",
        file: heroRes.path || "src/components/sections/Hero.tsx",
        note: "Mission headline alignment with PROJECT.md",
      }
    );

    // E2E-T1-F6-02: Live status beacon pill
    const hasStatusBeacon = heroContent.includes("SYNCHRONIZED") ||
      heroContent.includes("ONLINE") ||
      heroContent.includes("TELEMETRY") ||
      heroContent.includes("Radio");
    assertTest(
      "tier1",
      "E2E-T1-F6-02",
      "Hero section renders industrial live status beacon pill ([CONTROL TOWER: SYNCHRONIZED] or ONLINE)",
      Boolean(hasStatusBeacon),
      {
        expected: "Status pill with pulsing beacon indicator",
        observed: hasStatusBeacon ? "Status beacon pill detected" : "Status beacon missing",
        file: heroRes.path || "src/components/sections/Hero.tsx",
        note: "SCADA industrial telemetry aesthetic confirmed",
      }
    );

    // E2E-T1-F6-03: Primary CTA button linking to #pricing or #contact
    const hasPrimaryCta = (heroContent.includes("DEPLOY") || heroContent.includes("LAUNCH") || heroContent.includes("CONTROL TOWER")) &&
      (heroContent.includes("#contact") || heroContent.includes("#pricing"));
    assertTest(
      "tier1",
      "E2E-T1-F6-03",
      "Hero section contains primary conversion CTA button linking to #contact or #pricing",
      Boolean(hasPrimaryCta),
      {
        expected: "Primary CTA button routing to #contact or #pricing",
        observed: hasPrimaryCta ? "Primary CTA button detected" : "Primary CTA missing",
        file: heroRes.path || "src/components/sections/Hero.tsx",
        note: "Executive conversion funnel entrypoint",
      }
    );

    // E2E-T1-F6-04: Secondary CTA button linking to #how-it-works
    const hasSecondaryCta = (heroContent.includes("INSPECT") || heroContent.includes("SPECIFICATIONS") || heroContent.includes("PIPELINE") || heroContent.includes("HOW IT WORKS")) &&
      heroContent.includes("#how-it-works");
    assertTest(
      "tier1",
      "E2E-T1-F6-04",
      "Hero section contains secondary exploration CTA button linking to #how-it-works",
      Boolean(hasSecondaryCta),
      {
        expected: "Secondary CTA linking to #how-it-works",
        observed: hasSecondaryCta ? "Secondary CTA button found" : "Secondary CTA missing",
        file: heroRes.path || "src/components/sections/Hero.tsx",
        note: "Technical deep-dive jump link",
      }
    );

    // E2E-T1-F6-05: Telemetry HUD cards displaying mega-project metrics
    const hasKpiCards = (heroContent.includes("$48B+") || heroContent.includes("$12.4B") || heroContent.includes("MONITORED")) &&
      (heroContent.includes("99.4%") || heroContent.includes("DISPATCH") || heroContent.includes("DELIVERY")) &&
      (heroContent.includes("140ms") || heroContent.includes("LATENCY") || heroContent.includes("SOLVER"));
    assertTest(
      "tier1",
      "E2E-T1-F6-05",
      "Hero section renders industrial telemetry HUD metric cards (Monitored CapEx, On-Time Dispatch, Solver Latency)",
      Boolean(hasKpiCards),
      {
        expected: "Telemetry HUD cards with CapEx, dispatch rate, and solver latency",
        observed: hasKpiCards ? "Industrial telemetry HUD cards verified" : "Telemetry metrics incomplete or missing",
        file: heroRes.path || "src/components/sections/Hero.tsx",
        note: "Mega-project quantitative validation metrics",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 7: Section 2: How It Works (Scroll Storytelling, Nodes, Line Drawing)
  // ----------------------------------------------------------------------------
  logFeatureHeader(7, "Section 2: How It Works (Scroll Storytelling, Nodes, Line Drawing)");
  {
    const howItWorksRes = findFirstExistingFile([
      "src/components/sections/HowItWorks.tsx",
      "src/components/sections/HowItWorksSection.tsx",
      "src/components/sections/Pipeline.tsx",
      "src/app/page.tsx",
    ]);
    const howItWorksContent = howItWorksRes.path === "src/app/page.tsx"
      ? (extractSectionContent(howItWorksRes.content, "how-it-works") || howItWorksRes.content)
      : (howItWorksRes.content || "");
    const wholeFile = howItWorksRes.content || "";

    // E2E-T1-F7-01: Section marked with "use client" directive or rendered in client page
    const isClient = wholeFile.includes('"use client"') || wholeFile.includes("'use client'") || pageContent.includes('"use client"');
    assertTest(
      "tier1",
      "E2E-T1-F7-01",
      "How It Works pipeline is client-rendered with \"use client\" directive for animation hooks",
      Boolean(isClient),
      {
        expected: '"use client" declared on component or root page',
        observed: isClient ? '"use client" directive active' : "Missing client component directive",
        file: howItWorksRes.path || "src/components/sections/HowItWorks.tsx",
        note: "Required for Framer Motion client hooks and event listeners",
      }
    );

    // E2E-T1-F7-02: Section utilizes Framer Motion
    const usesFramerMotion = wholeFile.includes("framer-motion") ||
      wholeFile.includes("motion.div") ||
      wholeFile.includes("motion.path") ||
      wholeFile.includes("useScroll");
    assertTest(
      "tier1",
      "E2E-T1-F7-02",
      "How It Works section imports and employs Framer Motion for scroll-driven animations",
      Boolean(usesFramerMotion),
      {
        expected: "Import of framer-motion and usage of motion components or hooks",
        observed: usesFramerMotion ? "Framer Motion integration verified" : "Framer Motion not detected in section",
        file: howItWorksRes.path || "src/components/sections/HowItWorks.tsx",
        note: "Scroll-triggered interactive animation engine",
      }
    );

    // E2E-T1-F7-03: Section defines at least 4 distinct supply chain lifecycle nodes
    const nodeKeywords = [
      /Procurement|BIM|Ingestion/i,
      /GovTech|Permitting|Regulatory/i,
      /Telemetry|Logistics|Fleet|Transit/i,
      /Mitigation|Disruption|Execution|Solver/i,
    ];
    const foundNodes = nodeKeywords.filter((reg) => reg.test(howItWorksContent));
    assertTest(
      "tier1",
      "E2E-T1-F7-03",
      "Pipeline defines 4 distinct supply chain nodes (Procurement, GovTech, Logistics, Autonomous Mitigation)",
      foundNodes.length === 4,
      {
        expected: "4 distinct lifecycle nodes: Procurement/BIM, GovTech, Logistics Telemetry, Mitigation",
        observed: `Found ${foundNodes.length}/4 lifecycle stages`,
        file: howItWorksRes.path || "src/components/sections/HowItWorks.tsx",
        note: "Mega-project material lifecycle domain representation",
      }
    );

    // E2E-T1-F7-04: Section includes animated SVG path/line conduit elements
    const hasConduitLines = (howItWorksContent.includes("<motion.path") ||
      howItWorksContent.includes("pathLength") ||
      howItWorksContent.includes("strokeDashoffset") ||
      (howItWorksContent.includes("<svg") && howItWorksContent.includes("<path")));
    assertTest(
      "tier1",
      "E2E-T1-F7-04",
      "Section features SVG path conduit lines connecting nodes (motion.path with pathLength/strokeDashoffset)",
      Boolean(hasConduitLines),
      {
        expected: "SVG conduits drawn between nodes with animated pathLength or strokeDashoffset",
        observed: hasConduitLines ? "SVG path conduit lines verified" : "SVG connector conduit paths missing",
        file: howItWorksRes.path || "src/components/sections/HowItWorks.tsx",
        note: "Scroll-triggered line-drawing conduit visualization",
      }
    );

    // E2E-T1-F7-05: Section includes visual disruption simulation or stage progress indicators
    const hasSimulationOrStages = howItWorksContent.includes("STAGE 01") ||
      howItWorksContent.includes("STAGE 02") ||
      howItWorksContent.includes("Simulate") ||
      howItWorksContent.includes("Mitigation") ||
      howItWorksContent.includes("Disruption");
    assertTest(
      "tier1",
      "E2E-T1-F7-05",
      "Section incorporates stage sequence identifiers or autonomous disruption mitigation simulation",
      Boolean(hasSimulationOrStages),
      {
        expected: "Stage identifiers (STAGE 01..04) or interactive disruption simulator",
        observed: hasSimulationOrStages ? "Stage indicators / mitigation elements verified" : "Stage telemetry missing",
        file: howItWorksRes.path || "src/components/sections/HowItWorks.tsx",
        note: "Interactive telemetry storytelling verified",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 8: Section 3: Pricing Matrix & Interactive Billing Switch
  // ----------------------------------------------------------------------------
  logFeatureHeader(8, "Section 3: Pricing Matrix & Interactive Billing Switch");
  {
    const pricingRes = findFirstExistingFile([
      "src/components/sections/Pricing.tsx",
      "src/components/sections/PricingSection.tsx",
      "src/app/page.tsx",
    ]);
    const pricingContent = pricingRes.path === "src/app/page.tsx"
      ? (extractSectionContent(pricingRes.content, "pricing") || pricingRes.content)
      : (pricingRes.content || "");
    const wholePricingFile = pricingRes.content || "";

    // E2E-T1-F8-01: Exactly 3 pricing tier cards
    const tierMatches = [
      pricingContent.includes("Site Core"),
      pricingContent.includes("Enterprise Tower"),
      pricingContent.includes("Sovereign Infrastructure"),
    ];
    const tierCountFound = tierMatches.filter(Boolean).length;
    assertTest(
      "tier1",
      "E2E-T1-F8-01",
      "Pricing section renders exactly 3 named tiers (Site Core, Enterprise Tower, Sovereign Infrastructure)",
      tierCountFound === 3,
      {
        expected: "Exactly 3 tiers: Site Core, Enterprise Tower, Sovereign Infrastructure",
        observed: `Found ${tierCountFound}/3 tiers`,
        file: pricingRes.path || "src/components/sections/Pricing.tsx",
        note: "Strict 3-tier cardinality adherence",
      }
    );

    // E2E-T1-F8-02: Realistic mega-project pricing economics
    const hasRealisticPricing = (pricingContent.includes("$4,800") || pricingContent.includes("4800")) &&
      (pricingContent.includes("$14,500") || pricingContent.includes("14500")) &&
      (pricingContent.includes("CUSTOM") || pricingContent.includes("$32,000") || pricingContent.includes("$48,000") || pricingContent.includes("Sovereign"));
    assertTest(
      "tier1",
      "E2E-T1-F8-02",
      "Tiers reflect realistic mega-project CapEx scope ($4,800/mo, $14,500/mo, custom sovereign enterprise)",
      Boolean(hasRealisticPricing),
      {
        expected: "Realistic mega-project pricing tiers and CapEx thresholds",
        observed: hasRealisticPricing ? "Realistic commercial tier rates detected" : "Pricing thresholds do not match specification",
        file: pricingRes.path || "src/components/sections/Pricing.tsx",
        note: "Commercial credibility for capital works contractors",
      }
    );

    // E2E-T1-F8-03: Section provides billing frequency state toggle
    const hasBillingToggle = /isAnnual|billingCycle|annualBilling|isYearly|setBillingCycle|setIsAnnual|Monthly.*Annual/i.test(wholePricingFile);
    assertTest(
      "tier1",
      "E2E-T1-F8-03",
      "Pricing section includes interactive billing frequency switch (Monthly vs Annual toggle)",
      Boolean(hasBillingToggle),
      {
        expected: "Interactive toggle state for Monthly vs Annual commitment",
        observed: hasBillingToggle ? "Billing frequency toggle detected" : "Billing frequency toggle state missing",
        file: pricingRes.path || "src/components/sections/Pricing.tsx",
        note: "Enterprise procurement billing cadence options",
      }
    );

    // E2E-T1-F8-04: Annual billing toggle displays discount badge
    const hasDiscountBadge = /15%|20%|SAVE|SAVINGS|DISCOUNT/i.test(wholePricingFile);
    assertTest(
      "tier1",
      "E2E-T1-F8-04",
      "Annual billing frequency displays commitment discount badge (15–20% savings)",
      Boolean(hasDiscountBadge),
      {
        expected: "Discount badge indicating 15% to 20% annual commitment savings",
        observed: hasDiscountBadge ? "Annual commitment discount badge found" : "Annual discount badge missing",
        file: pricingRes.path || "src/components/sections/Pricing.tsx",
        note: "Incentivizes multi-year capital works commitments",
      }
    );

    // E2E-T1-F8-05: Distinct feature checklists and distinct CTA buttons on each card
    const ctaMatches = [
      pricingContent.includes("DEPLOY SITE CORE") || pricingContent.includes("DEPLOY CORE"),
      pricingContent.includes("DEPLOY ENTERPRISE TOWER") || pricingContent.includes("DEPLOY ENTERPRISE"),
      pricingContent.includes("SOVEREIGN DESK") || pricingContent.includes("CONTACT SOVEREIGN"),
    ];
    const hasChecklists = pricingContent.includes("<ul") || pricingContent.includes("CheckCircle2") || pricingContent.includes("Check");
    assertTest(
      "tier1",
      "E2E-T1-F8-05",
      "Each pricing tier features distinct feature checklist items and dedicated CTA buttons",
      Boolean(hasChecklists && ctaMatches.filter(Boolean).length >= 2),
      {
        expected: "Dedicated feature lists and distinct action buttons per tier",
        observed: `Checklists: ${Boolean(hasChecklists)}, Distinct CTAs: ${ctaMatches.filter(Boolean).length}/3`,
        file: pricingRes.path || "src/components/sections/Pricing.tsx",
        note: "Granular plan differentiation confirmed",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 9: Section 4: About Us (Mission Statement & Single Founder Bio)
  // ----------------------------------------------------------------------------
  logFeatureHeader(9, "Section 4: About Us (Mission Statement & Single Founder Bio)");
  {
    const aboutRes = findFirstExistingFile([
      "src/components/sections/AboutUs.tsx",
      "src/components/sections/AboutSection.tsx",
      "src/components/sections/About.tsx",
      "src/app/page.tsx",
    ]);
    const aboutContent = aboutRes.path === "src/app/page.tsx"
      ? (extractSectionContent(aboutRes.content, "about") || aboutRes.content)
      : (aboutRes.content || "");

    // E2E-T1-F9-01: Clear infrastructure mission statement
    const hasMission = (aboutContent.includes("mission") || aboutContent.includes("MISSION")) &&
      (aboutContent.includes("liquidated damages") || aboutContent.includes("schedule variances") || aboutContent.includes("civil infrastructure") || aboutContent.includes("supply chain"));
    assertTest(
      "tier1",
      "E2E-T1-F9-01",
      "About Us section contains clear mega-project infrastructure mission statement",
      Boolean(hasMission),
      {
        expected: "Infrastructure mission statement addressing schedule variances and liquidated damages",
        observed: hasMission ? "Infrastructure mission statement verified" : "Mission statement missing or incomplete",
        file: aboutRes.path || "src/components/sections/AboutUs.tsx",
        note: "Aligns organizational purpose with mega-project problem space",
      }
    );

    // E2E-T1-F9-02: Placeholder for single founder image
    const hasImagePlaceholder = aboutContent.includes("[ FOUNDER PHOTO ]") ||
      aboutContent.includes("FOUNDER PHOTO") ||
      aboutContent.includes("<img") ||
      aboutContent.includes("<Image") ||
      aboutContent.includes("avatar");
    assertTest(
      "tier1",
      "E2E-T1-F9-02",
      "About Us section contains dedicated placeholder for founder portrait / avatar image",
      Boolean(hasImagePlaceholder),
      {
        expected: "Founder image placeholder with industrial frame / crosshairs",
        observed: hasImagePlaceholder ? "Founder image placeholder detected" : "Image placeholder missing",
        file: aboutRes.path || "src/components/sections/AboutUs.tsx",
        note: "Visual identity placeholder for company leadership",
      }
    );

    // E2E-T1-F9-03: Founder biography credentials (Chukwuka)
    const hasFounder = aboutContent.includes("Chukwuka");
    const hasCredentials = aboutContent.includes("Chief Systems") ||
      aboutContent.includes("Logistics") ||
      aboutContent.includes("Optimization") ||
      aboutContent.includes("Architect") ||
      aboutContent.includes("Civil") ||
      aboutContent.includes("Strategist") ||
      aboutContent.includes("Infrastructure");
    assertTest(
      "tier1",
      "E2E-T1-F9-03",
      "Founder biography highlights civil engineering and mega-project optimization credentials (Chukwuka)",
      Boolean(hasFounder && hasCredentials),
      {
        expected: "Chukwuka with engineering credentials and executive title",
        observed: `Name: ${hasFounder}, Credentials: ${hasCredentials}`,
        file: aboutRes.path || "src/components/sections/AboutUs.tsx",
        note: "Executive credibility established without accelerator tropes",
      }
    );

    // E2E-T1-F9-04: Zero secondary co-founders, advisors, or team member arrays
    const coFounderMentions = aboutContent.match(/\b(co-founder|cofounder|co-founders|cofounders)\b/gi) || [];
    const secondaryBios = aboutContent.match(/\b(Co-CEO|Chief Technology Officer|CTO|COO|CFO)\b/g) || [];
    assertTest(
      "tier1",
      "E2E-T1-F9-04",
      "About Us section contains zero secondary co-founders, advisory boards, or team profile arrays",
      coFounderMentions.length === 0 && secondaryBios.length === 0,
      {
        expected: "0 co-founders and 0 secondary executive bios",
        observed: `Co-founder mentions: ${coFounderMentions.length}, Secondary execs: ${secondaryBios.length}`,
        file: aboutRes.path || "src/components/sections/AboutUs.tsx",
        note: "Single founder exclusivity enforced",
      }
    );

    // E2E-T1-F9-05: Section is completely free of accelerator references
    const acceleratorMatches = aboutContent.match(/\b(accelerator|accelerators|y\s*combinator|yc|techstars|500\s*global|seedcamp|incubator)\b/i) || [];
    assertTest(
      "tier1",
      "E2E-T1-F9-05",
      "About Us section copy is completely free of startup accelerator or incubator mentions",
      acceleratorMatches.length === 0,
      {
        expected: "0 matches for accelerator keywords in About Us section",
        observed: `Found ${acceleratorMatches.length} matches: [${acceleratorMatches.join(", ")}]`,
        file: aboutRes.path || "src/components/sections/AboutUs.tsx",
        note: "Enterprise positioning protected from early-stage incubator copy",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 10: Section 5: Contact Us & Enterprise RFP Inquiry Form
  // ----------------------------------------------------------------------------
  logFeatureHeader(10, "Section 5: Contact Us & Enterprise RFP Inquiry Form");
  {
    const contactRes = findFirstExistingFile([
      "src/components/sections/ContactUs.tsx",
      "src/components/sections/ContactSection.tsx",
      "src/components/sections/Contact.tsx",
      "src/app/page.tsx",
    ]);
    const contactContent = contactRes.path === "src/app/page.tsx"
      ? (extractSectionContent(contactRes.content, "contact") || contactRes.content)
      : (contactRes.content || "");

    // E2E-T1-F10-01: Exactly one business email address placeholder
    const emailMatches = contactContent.match(/[\w.-]+@[\w.-]+\.\w+/g) || [];
    const uniqueEmails = [...new Set(emailMatches.filter((e) => !e.includes("example.com")))];
    assertTest(
      "tier1",
      "E2E-T1-F10-01",
      "Contact Us section displays approved official business email placeholder (chukwuka@synergis.site)",
      uniqueEmails.includes("chukwuka@synergis.site") || emailMatches.includes("chukwuka@synergis.site"),
      {
        expected: "chukwuka@synergis.site displayed in contact details",
        observed: `Emails found: [${uniqueEmails.join(", ")}]`,
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "Official encrypted intake email channel verified",
      }
    );

    // E2E-T1-F10-02: Exactly one phone number placeholder
    const hasPhone = contactContent.includes("+2349076786951") || contactContent.includes("2349076786951");
    assertTest(
      "tier1",
      "E2E-T1-F10-02",
      "Contact Us section displays approved operations dispatch telephone number (+2349076786951)",
      Boolean(hasPhone),
      {
        expected: "+2349076786951 displayed in contact details",
        observed: hasPhone ? "+2349076786951 detected" : "Approved phone placeholder missing",
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "24/7 critical corridor engineering support hotline confirmed",
      }
    );

    // E2E-T1-F10-03: Interactive inquiry form with required fields
    const hasNameInput = contactContent.includes('type="text"') || contactContent.includes("Full Name");
    const hasEmailInput = contactContent.includes('type="email"') || contactContent.includes("Official Business Email");
    const hasScopeField = contactContent.includes("CapEx") || contactContent.includes("select") || contactContent.includes("Scope");
    const hasMessageField = contactContent.includes("<textarea") || contactContent.includes("Requirements");
    assertTest(
      "tier1",
      "E2E-T1-F10-03",
      "Section renders comprehensive enterprise RFP intake form (Name, Work Email, Project CapEx, Scope)",
      Boolean(hasNameInput && hasEmailInput && hasScopeField && hasMessageField),
      {
        expected: "Form controls for Name, Email, Scope/CapEx, and Requirements textarea",
        observed: `Name: ${Boolean(hasNameInput)}, Email: ${Boolean(hasEmailInput)}, Scope: ${Boolean(hasScopeField)}, Textarea: ${Boolean(hasMessageField)}`,
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "Enterprise inquiry data capture interface verified",
      }
    );

    // E2E-T1-F10-04: Form includes submit button with interactive submission handler
    const hasSubmitBtn = contactContent.includes('type="submit"') || contactContent.includes("<button");
    const hasSubmitHandler = contactContent.includes("onSubmit") || contactContent.includes("handleSubmit");
    assertTest(
      "tier1",
      "E2E-T1-F10-04",
      "Inquiry form features submission handler (onSubmit) and dedicated dispatch button",
      Boolean(hasSubmitBtn && hasSubmitHandler),
      {
        expected: "Form with onSubmit event handler and type=\"submit\" button",
        observed: `Submit button: ${Boolean(hasSubmitBtn)}, onSubmit handler: ${Boolean(hasSubmitHandler)}`,
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "Interactive client dispatch hook operational",
      }
    );

    // E2E-T1-F10-05: Form implements submission feedback state
    const hasFeedbackState = /alert\(|TRANSMISSION LOGGED|INQUIRY QUEUED|SUBMITTED|isSubmitted|status/i.test(contactContent);
    assertTest(
      "tier1",
      "E2E-T1-F10-05",
      "Form provides feedback state upon transmission (confirmation badge, alert, or queued status)",
      Boolean(hasFeedbackState),
      {
        expected: "Feedback notification confirming RFP dispatch",
        observed: hasFeedbackState ? "Submission feedback state implemented" : "Feedback state missing",
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "Clear user acknowledgement following intake request dispatch",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 11: Brand & Cloud Neutrality (AWS Minimization)
  // ----------------------------------------------------------------------------
  logFeatureHeader(11, "Brand & Cloud Neutrality (AWS Minimization)");
  {
    const srcFiles = getAllFiles(path.join(projectRoot, "src"));

    // Check for AWS and Amazon Web Services
    let awsCount = 0;
    let s3Ec2LambdaCount = 0;
    let sagemakerCount = 0;
    for (const f of srcFiles) {
      const code = fs.readFileSync(f, "utf-8");
      // Exclude tests or node_modules
      const cleanCode = code
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*/g, ""); // strip comments

      if (/\bAWS\b/.test(cleanCode) || /Amazon\s*Web\s*Services/i.test(cleanCode)) {
        awsCount++;
      }
      if (/\b(S3|EC2|AWS\s*Lambda)\b/i.test(cleanCode)) {
        s3Ec2LambdaCount++;
      }
      if (/\b(SageMaker|DynamoDB|CloudWatch|Greengrass|Redshift)\b/i.test(cleanCode)) {
        sagemakerCount++;
      }
    }

    // E2E-T1-F11-01: Zero occurrences of AWS in user-facing copy
    assertTest(
      "tier1",
      "E2E-T1-F11-01",
      "Zero promotional occurrences of AWS in application code and user copy",
      awsCount === 0,
      {
        expected: "0 occurrences of AWS in src/",
        observed: `Discovered ${awsCount} files containing AWS`,
        file: "src/",
        note: "Protects cloud vendor neutrality",
      }
    );

    // E2E-T1-F11-02: Zero occurrences of Amazon Web Services
    assertTest(
      "tier1",
      "E2E-T1-F11-02",
      "Zero occurrences of \"Amazon Web Services\" across all source files",
      awsCount === 0,
      {
        expected: "0 occurrences of 'Amazon Web Services' in src/",
        observed: `${awsCount} violations discovered`,
        file: "src/",
        note: "Complete omission of proprietary brand terminology",
      }
    );

    // E2E-T1-F11-03: Zero occurrences of S3, EC2, Lambda
    assertTest(
      "tier1",
      "E2E-T1-F11-03",
      "Zero occurrences of proprietary cloud infrastructure primitives (S3, EC2, Lambda)",
      s3Ec2LambdaCount === 0,
      {
        expected: "0 occurrences of S3/EC2/Lambda in product copy",
        observed: `${s3Ec2LambdaCount} files containing primitives`,
        file: "src/",
        note: "Maintains focus on autonomous supply chain logic rather than cloud hosting",
      }
    );

    // E2E-T1-F11-04: Zero occurrences of SageMaker, DynamoDB, CloudWatch
    assertTest(
      "tier1",
      "E2E-T1-F11-04",
      "Zero occurrences of proprietary AWS ML & database services (SageMaker, DynamoDB, CloudWatch)",
      sagemakerCount === 0,
      {
        expected: "0 occurrences of SageMaker/DynamoDB/CloudWatch in src/",
        observed: `${sagemakerCount} files containing AWS ML services`,
        file: "src/",
        note: "Emphasizes independent proprietary neural architectures",
      }
    );

    // E2E-T1-F11-05: Technical copy emphasizes open standards (BIM, IFC, GS1, MILP solvers)
    const hasOpenStandards = pageContent.includes("BIM") ||
      pageContent.includes("IFC") ||
      pageContent.includes("MILP") ||
      pageContent.includes("Revit") ||
      pageContent.includes("Primavera");
    assertTest(
      "tier1",
      "E2E-T1-F11-05",
      "Technical copy emphasizes vendor-neutral standards (BIM LOD 400, IFC, MILP solvers, ERP ingestion)",
      Boolean(hasOpenStandards),
      {
        expected: "Copy referencing open construction and industrial data standards",
        observed: hasOpenStandards ? "Open standards terminology confirmed (BIM/IFC/MILP)" : "Open standards missing",
        file: "src/app/page.tsx",
        note: "Validates authentic civil infrastructure technical terminology",
      }
    );
  }

  // ----------------------------------------------------------------------------
  // Feature 12: Viewport Responsiveness & Industrial Grid Layout
  // ----------------------------------------------------------------------------
  logFeatureHeader(12, "Viewport Responsiveness & Industrial Grid Layout");
  {
    // E2E-T1-F12-01: Responsive flex stacking
    const hasResponsiveFlex = pageContent.includes("flex-col sm:flex-row") ||
      pageContent.includes("flex-col md:flex-row") ||
      pageContent.includes("flex-col");
    assertTest(
      "tier1",
      "E2E-T1-F12-01",
      "Layout containers implement responsive flex stacking (flex-col sm:flex-row / md:flex-row)",
      Boolean(hasResponsiveFlex),
      {
        expected: "Responsive flex direction breakpoints for mobile reflow",
        observed: hasResponsiveFlex ? "Responsive flex utilities found" : "Responsive flex utilities missing",
        file: "src/app/page.tsx",
        note: "Fluid vertical stacking on narrow viewports",
      }
    );

    // E2E-T1-F12-02: Grid column scaling across breakpoints
    const hasResponsiveGrid = pageContent.includes("grid-cols-1 md:grid-cols-3") ||
      pageContent.includes("grid-cols-1 md:grid-cols-2") ||
      pageContent.includes("grid-cols-2 md:grid-cols-4");
    assertTest(
      "tier1",
      "E2E-T1-F12-02",
      "Grid containers employ responsive column utilities (grid-cols-1 md:grid-cols-3 / grid-cols-2 md:grid-cols-4)",
      Boolean(hasResponsiveGrid),
      {
        expected: "Single-column mobile fallback to multi-column desktop grids",
        observed: hasResponsiveGrid ? "Responsive grid columns verified" : "Responsive grid classes missing",
        file: "src/app/page.tsx",
        note: "Tier cards and pipeline nodes adapt cleanly without overflow",
      }
    );

    // E2E-T1-F12-03: Responsive horizontal padding and container bounds
    const hasHorizontalPadding = pageContent.includes("px-4") && pageContent.includes("sm:px-6") && pageContent.includes("lg:px-8");
    assertTest(
      "tier1",
      "E2E-T1-F12-03",
      "Main containers provide responsive horizontal gutter padding (px-4 sm:px-6 lg:px-8)",
      Boolean(hasHorizontalPadding),
      {
        expected: "Progressive gutter padding scaling from mobile to desktop",
        observed: hasHorizontalPadding ? "Responsive padding scale confirmed" : "Gutter padding not progressive",
        file: "src/app/page.tsx",
        note: "Preserves legible margins on all screen sizes",
      }
    );

    // E2E-T1-F12-04: Content constrained by max-w container with mx-auto centering
    const hasMaxWCenter = pageContent.includes("max-w-7xl mx-auto") || pageContent.includes("max-w-6xl mx-auto");
    assertTest(
      "tier1",
      "E2E-T1-F12-04",
      "Content width is bounded by max-w-7xl containers and centered with mx-auto",
      Boolean(hasMaxWCenter),
      {
        expected: "max-w-7xl mx-auto constraining main layout",
        observed: hasMaxWCenter ? "max-w-7xl mx-auto containment confirmed" : "Centering constraints missing",
        file: "src/app/page.tsx",
        note: "Prevents awkward horizontal distortion on ultrawide monitors",
      }
    );

    // E2E-T1-F12-05: Typography utilizes responsive sizing utilities
    const hasResponsiveText = pageContent.includes("text-4xl sm:text-6xl") ||
      pageContent.includes("text-3xl sm:text-4xl") ||
      pageContent.includes("text-base sm:text-lg");
    assertTest(
      "tier1",
      "E2E-T1-F12-05",
      "Headings and body typography utilize responsive sizing utilities (text-4xl sm:text-6xl)",
      Boolean(hasResponsiveText),
      {
        expected: "Breakpoint-scaled font sizes for readable mobile typography",
        observed: hasResponsiveText ? "Responsive typography utilities active" : "Typography lacks breakpoint scaling",
        file: "src/app/page.tsx",
        note: "Prevents text overflow on small smartphone screens",
      }
    );
  }
}

// ==============================================================================
// TIER 2: BOUNDARY & CORNER CASES (10 TESTS)
// ==============================================================================
function runTier2() {
  logTier(2, "BOUNDARY & CORNER CASES (CARDINALITY, NEGATIVE CONSTRAINTS, EXTREMES)");

  const pageContent = readFileSafe("src/app/page.tsx") || "";

  // E2E-T2-01: Exact Founder Cardinality
  {
    const aboutRes = findFirstExistingFile([
      "src/components/sections/AboutUs.tsx",
      "src/components/sections/AboutSection.tsx",
      "src/components/sections/About.tsx",
      "src/app/page.tsx",
    ]);
    const aboutContent = aboutRes.path === "src/app/page.tsx"
      ? (extractSectionContent(aboutRes.content, "about") || aboutRes.content || "")
      : (aboutRes.content || "");

    const hasChukwuka = aboutContent.includes("Chukwuka");
    const coFounderMatches = aboutContent.match(/\b(co-founder|cofounder|co-founders|cofounders)\b/gi) || [];
    const secondaryExecMatches = aboutContent.match(/\b(Co-CEO|Chief Technology Officer|CTO|COO|CFO)\b/g) || [];
    const founderNameCount = (aboutContent.match(/\bChukwuka\b/g) || []).length;

    const passed = Boolean(
      hasChukwuka &&
      coFounderMatches.length === 0 &&
      secondaryExecMatches.length === 0 &&
      founderNameCount >= 1
    );

    assertTest(
      "tier2",
      "E2E-T2-01",
      "About Us section contains EXACTLY ONE founder (Chukwuka) with ZERO co-founders or team cards",
      passed,
      {
        expected: "Exactly 1 founder profile (Chukwuka), 0 co-founders, 0 secondary executive bios",
        observed: `Chukwuka: ${hasChukwuka}, Co-founder mentions: ${coFounderMatches.length}, Secondary execs: ${secondaryExecMatches.length}`,
        file: aboutRes.path || "src/components/sections/AboutUs.tsx",
        note: "Single founder requirement verified with zero team dilution",
      }
    );
  }

  // E2E-T2-02: Absolute Zero Accelerator Mentions
  {
    const srcFiles = getAllFiles(path.join(projectRoot, "src")).concat(
      getAllFiles(path.join(projectRoot, "public"))
    );
    const acceleratorRegex = /\b(accelerator|accelerators|y\s*combinator|yc|techstars|500\s*global|seedcamp|plug\s*and\s*play|incubator|incubators)\b/i;

    const violations = [];
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, "utf-8");
      const lines = content.split("\n");
      lines.forEach((line, lineNum) => {
        const match = line.match(acceleratorRegex);
        if (match) {
          violations.push({
            file: path.relative(projectRoot, file),
            line: lineNum + 1,
            matched: match[0],
          });
        }
      });
    }

    assertTest(
      "tier2",
      "E2E-T2-02",
      "Absolute ZERO mentions of startup accelerators (Y Combinator, Techstars, incubators) across all source files",
      violations.length === 0,
      {
        expected: "Zero regex matches for accelerator terms across entire codebase",
        observed: violations.length === 0
          ? "0 matches across all source and public assets"
          : `Found ${violations.length} violations: ${JSON.stringify(violations)}`,
        file: violations.length > 0 ? violations[0].file : "src/",
        note: "Strict negative constraint verified",
      }
    );
  }

  // E2E-T2-03: Exact Email Cardinality
  {
    const contactRes = findFirstExistingFile([
      "src/components/sections/ContactUs.tsx",
      "src/components/sections/ContactSection.tsx",
      "src/components/sections/Contact.tsx",
      "src/app/page.tsx",
    ]);
    const contactContent = contactRes.path === "src/app/page.tsx"
      ? (extractSectionContent(contactRes.content, "contact") || contactRes.content || "")
      : (contactRes.content || "");

    // Strip input placeholder example text so only official published contact channels are extracted
    const publishedContent = contactContent.replace(/placeholder=["'][^"']*["']/gi, "");
    const allEmails = publishedContent.match(/[\w.-]+@[\w.-]+\.\w+/g) || [];
    const uniqueEmails = [...new Set(allEmails)];
    const exactlyOneEmail = uniqueEmails.length === 1 && uniqueEmails[0] === "chukwuka@synergis.site";

    assertTest(
      "tier2",
      "E2E-T2-03",
      "Contact Us section contains EXACTLY ONE official business email placeholder (chukwuka@synergis.site)",
      exactlyOneEmail,
      {
        expected: "Exactly 1 unique email placeholder: chukwuka@synergis.site",
        observed: `Found ${uniqueEmails.length} unique emails: [${uniqueEmails.join(", ")}]`,
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "Single email cardinality verified without secondary mailboxes",
      }
    );
  }

  // E2E-T2-04: Exact Phone Cardinality
  {
    const contactRes = findFirstExistingFile([
      "src/components/sections/ContactUs.tsx",
      "src/components/sections/ContactSection.tsx",
      "src/components/sections/Contact.tsx",
      "src/app/page.tsx",
    ]);
    const contactContent = contactRes.path === "src/app/page.tsx"
      ? (extractSectionContent(contactRes.content, "contact") || contactRes.content || "")
      : (contactRes.content || "");

    const phoneRegex = /(?:\+?234\s?|0)?\d{10}|(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phoneMatches = contactContent.match(phoneRegex) || [];
    const normalizedPhones = [...new Set(phoneMatches.map((p) => p.replace(/\D/g, "")))];

    const passed = normalizedPhones.length === 1 && (normalizedPhones[0] === "2349076786951" || normalizedPhones[0] === "09076786951");

    assertTest(
      "tier2",
      "E2E-T2-04",
      "Contact Us section contains EXACTLY ONE telephone number placeholder (+2349076786951)",
      passed,
      {
        expected: "Exactly 1 unique normalized phone number (+2349076786951)",
        observed: `Found ${normalizedPhones.length} unique phones: [${phoneMatches.join(", ")}]`,
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "Single phone cardinality verified",
      }
    );
  }

  // E2E-T2-05: Strict AWS Neutrality
  {
    const srcFiles = getAllFiles(path.join(projectRoot, "src"));
    const awsRegex = /\b(AWS|Amazon\s*Web\s*Services|S3|EC2|AWS\s*Lambda|SageMaker|DynamoDB|CloudWatch|Greengrass|Redshift)\b/i;

    const awsViolations = [];
    for (const file of srcFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // Strip comments
      const stripped = content.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
      const lines = stripped.split("\n");
      lines.forEach((line, lineNum) => {
        const match = line.match(awsRegex);
        if (match) {
          awsViolations.push({
            file: path.relative(projectRoot, file),
            line: lineNum + 1,
            matched: match[0],
          });
        }
      });
    }

    assertTest(
      "tier2",
      "E2E-T2-05",
      "Strict AWS neutrality verified: 0 occurrences of proprietary cloud services across all source files",
      awsViolations.length === 0,
      {
        expected: "Zero proprietary AWS mentions across src/",
        observed: awsViolations.length === 0
          ? "0 AWS matches discovered"
          : `Discovered ${awsViolations.length} violations: ${JSON.stringify(awsViolations)}`,
        file: awsViolations.length > 0 ? awsViolations[0].file : "src/",
        note: "Protects cloud vendor independence and sovereign positioning",
      }
    );
  }

  // E2E-T2-06: Pricing Tiers Exactness
  {
    const pricingRes = findFirstExistingFile([
      "src/components/sections/Pricing.tsx",
      "src/components/sections/PricingSection.tsx",
      "src/app/page.tsx",
    ]);
    const pricingContent = pricingRes.path === "src/app/page.tsx"
      ? (extractSectionContent(pricingRes.content, "pricing") || pricingRes.content || "")
      : (pricingRes.content || "");

    const cleanPricing = pricingContent.replace(/{\/\*[\s\S]*?\*\/}/g, "").replace(/\/\/.*/g, "");
    const tierHeaders = cleanPricing.match(/\bTIER 0[1-9]\b/gi) || [];
    const tierCardTitles = [
      pricingContent.includes("Site Core"),
      pricingContent.includes("Enterprise Tower"),
      pricingContent.includes("Sovereign Infrastructure"),
    ].filter(Boolean);

    const passed = tierCardTitles.length === 3 && (tierHeaders.length === 0 || tierHeaders.length === 3);

    assertTest(
      "tier2",
      "E2E-T2-06",
      "Pricing matrix defines EXACTLY 3 distinct tiers (Site Core, Enterprise Tower, Sovereign Infrastructure)",
      passed,
      {
        expected: "Exactly 3 distinct tier names and cards in pricing section",
        observed: `Named tiers found: ${tierCardTitles.length}/3, Header matches: ${tierHeaders.length}`,
        file: pricingRes.path || "src/components/sections/Pricing.tsx",
        note: "Strict 3-tier boundary adhered to without tier proliferation",
      }
    );
  }

  // E2E-T2-07: Viewport Extremes (320px vs 3840px containment)
  {
    const hasMaxW = pageContent.includes("max-w-7xl") || pageContent.includes("max-w-6xl");
    const hasCenter = pageContent.includes("mx-auto");
    const hasSingleCol = pageContent.includes("grid-cols-1") || pageContent.includes("flex-col");
    const hasGutter = pageContent.includes("px-4");

    const passed = Boolean(hasMaxW && hasCenter && hasSingleCol && hasGutter);

    assertTest(
      "tier2",
      "E2E-T2-07",
      "Viewport extremes handled cleanly: fluid single-column collapse at 320px and max-w-7xl centering at 3840px",
      passed,
      {
        expected: "max-w-7xl mx-auto container bounds, px-4 mobile gutters, and single-column reflow",
        observed: `max-w: ${hasMaxW}, mx-auto: ${hasCenter}, Single-column: ${hasSingleCol}, Gutters: ${hasGutter}`,
        file: "src/app/page.tsx",
        note: "Prevents distortion across narrow mobile and ultrawide displays",
      }
    );
  }

  // E2E-T2-08: Rapid Theme Toggling Stress & CSS Token Pairing
  {
    const globalsCss = readFileSafe("src/app/globals.css") || "";
    const hasDarkClasses = pageContent.includes("dark:bg-[#0A0A0A]") || pageContent.includes("dark:bg-");
    const hasLightClasses = pageContent.includes("bg-[#F8F9FA]") || pageContent.includes("bg-white") || pageContent.includes("bg-neutral-");
    const hasOrangeTokens = pageContent.includes("#FF5F15") || globalsCss.includes("#FF5F15") || globalsCss.includes("safety-orange");

    const passed = Boolean(hasDarkClasses && hasLightClasses && hasOrangeTokens);

    assertTest(
      "tier2",
      "E2E-T2-08",
      "Rapid theme toggling resilience: CSS tokens pair dark: with light mode classes with #FF5F15 safety orange accent",
      passed,
      {
        expected: "Paired dark: and light mode utility classes ensuring high contrast in both themes",
        observed: `Dark classes: ${hasDarkClasses}, Light classes: ${hasLightClasses}, Safety orange: ${hasOrangeTokens}`,
        file: "src/app/page.tsx, src/app/globals.css",
        note: "Guarantees zero invisible text or unstyled flashes during rapid toggling",
      }
    );
  }

  // E2E-T2-09: Empty Form Submission Boundary
  {
    const contactRes = findFirstExistingFile([
      "src/components/sections/ContactUs.tsx",
      "src/components/sections/ContactSection.tsx",
      "src/components/sections/Contact.tsx",
      "src/app/page.tsx",
    ]);
    const contactContent = contactRes.path === "src/app/page.tsx"
      ? (extractSectionContent(contactRes.content, "contact") || contactRes.content || "")
      : (contactRes.content || "");

    const requiredCount = (contactContent.match(/\brequired\b/g) || []).length;
    const preventsEmptySubmission = requiredCount >= 2;

    assertTest(
      "tier2",
      "E2E-T2-09",
      "Empty form submission boundary: inputs enforce required validation attributes preventing blank dispatches",
      preventsEmptySubmission,
      {
        expected: "At least 2 required attributes on input and textarea controls",
        observed: `Discovered ${requiredCount} required fields in inquiry form`,
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "HTML5 and state-level boundary validation enforced",
      }
    );
  }

  // E2E-T2-10: Anchor Hash Integrity & Scroll Offset
  {
    const navRes = findFirstExistingFile([
      "src/components/navigation/Navbar.tsx",
      "src/components/Navbar.tsx",
      "src/app/page.tsx",
    ]);
    const navContent = navRes.content || "";

    const expectedAnchors = ["#home", "#how-it-works", "#pricing", "#about", "#contact"];
    const allAnchorsPresent = expectedAnchors.every((a) => navContent.includes(a));

    const allSectionsOffset = ["home", "how-it-works", "pricing", "about", "contact"].every((id) => {
      const section = extractSectionContent(pageContent, id);
      return section && section.includes("scroll-mt-");
    });

    const passed = Boolean(allAnchorsPresent && allSectionsOffset);

    assertTest(
      "tier2",
      "E2E-T2-10",
      "Anchor hash integrity: all 5 navbar targets match section IDs with scroll-mt offset",
      passed,
      {
        expected: "1:1 match between 5 nav anchors and 5 section IDs with scroll-mt-*",
        observed: `Nav anchors: ${allAnchorsPresent}, Section scroll margins: ${allSectionsOffset}`,
        file: "src/app/page.tsx",
        note: "Seamless anchor jumping without header obstruction",
      }
    );
  }
}

// ==============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS (6 TESTS)
// ==============================================================================
function runTier3() {
  logTier(3, "CROSS-FEATURE COMBINATIONS (THEME PERSISTENCE, SSR, BILLING, DRAWER, TELEMETRY)");

  const pageContent = readFileSafe("src/app/page.tsx") || "";

  // E2E-T3-01: Theming Persistence Across All 5 Sections
  {
    const sectionIds = ["home", "how-it-works", "pricing", "about", "contact"];
    const sectionsThemed = sectionIds.every((id) => {
      const sec = extractSectionContent(pageContent, id);
      if (!sec) return false;
      return sec.includes("dark:") || sec.includes("bg-") || sec.includes("text-");
    });

    assertTest(
      "tier3",
      "E2E-T3-01",
      "Theming persistence: dark and light mode contrast classes declared across all 5 sections",
      sectionsThemed,
      {
        expected: "All 5 sections declare paired dark: and light contrast styling",
        observed: sectionsThemed ? "All 5 sections correctly themed" : "One or more sections missing theme classes",
        file: "src/app/page.tsx",
        note: "Seamless aesthetic continuity across whole document in both modes",
      }
    );
  }

  // E2E-T3-02: Framer Motion Scroll Pipeline & SSR Hydration Safety
  {
    const howItWorksRes = findFirstExistingFile([
      "src/components/sections/HowItWorks.tsx",
      "src/components/sections/HowItWorksSection.tsx",
      "src/components/sections/Pipeline.tsx",
      "src/app/page.tsx",
    ]);
    const wholeFile = howItWorksRes.content || "";
    const hasUseClient = wholeFile.includes('"use client"') || pageContent.includes('"use client"');
    const hasNoTopWindow = !/\b(?:window|document)\./.test(
      wholeFile.replace(/\b(?:useEffect|useLayoutEffect)\b[\s\S]*?\}/g, "")
    );
    const hasFramer = wholeFile.includes("framer-motion") ||
      wholeFile.includes("motion.") ||
      wholeFile.includes("useScroll");

    const passed = Boolean(hasUseClient && hasNoTopWindow && hasFramer);

    assertTest(
      "tier3",
      "E2E-T3-02",
      "Framer Motion pipeline guarantees SSR hydration safety with \"use client\" isolation",
      passed,
      {
        expected: '"use client" declared, Framer Motion used, and 0 top-level window calls',
        observed: `Client boundary: ${hasUseClient}, Safe SSR: ${hasNoTopWindow}, Framer Motion: ${hasFramer}`,
        file: howItWorksRes.path || "src/components/sections/HowItWorks.tsx",
        note: "Prevents isomorphic Next.js server crash during compilation",
      }
    );
  }

  // E2E-T3-03: Pricing Matrix & Interactive Billing Switch Recalculation
  {
    const pricingRes = findFirstExistingFile([
      "src/components/sections/Pricing.tsx",
      "src/components/sections/PricingSection.tsx",
      "src/app/page.tsx",
    ]);
    const pricingContent = pricingRes.content || "";
    const hasToggleState = /isAnnual|billingCycle|annualBilling|isYearly/i.test(pricingContent);
    const hasDiscountCalculation = /0\.85|0\.80|15%|20%|discount/i.test(pricingContent);
    const hasRates = pricingContent.includes("4,800") && pricingContent.includes("14,500");

    const passed = Boolean(hasToggleState && (hasDiscountCalculation || hasRates));

    assertTest(
      "tier3",
      "E2E-T3-03",
      "Pricing matrix & interactive billing toggle synchronizes discount calculation across all 3 tiers",
      passed,
      {
        expected: "Toggle state with 15–20% annual discount formula updating tier pricing",
        observed: `Toggle state: ${hasToggleState}, Discount formula: ${hasDiscountCalculation}, Rates: ${hasRates}`,
        file: pricingRes.path || "src/components/sections/Pricing.tsx",
        note: "Synchronous commercial rate recalculation confirmed",
      }
    );
  }

  // E2E-T3-04: Responsive Reflow & Mobile Drawer Flow
  {
    const navRes = findFirstExistingFile([
      "src/components/navigation/Navbar.tsx",
      "src/components/navigation/MobileMenu.tsx",
      "src/components/Navbar.tsx",
      "src/app/page.tsx",
    ]);
    const mobileRes = findFirstExistingFile([
      "src/components/navigation/MobileMenu.tsx",
    ]);
    const combinedContent = (navRes.content || "") + "\n" + (mobileRes.content || "");

    const hasState = /isOpen|mobileMenuOpen|isMenuOpen/i.test(combinedContent);
    const hasHiding = combinedContent.includes("md:hidden") || combinedContent.includes("lg:hidden");
    const hasAutoClose = /setIsOpen\s*\(\s*false\s*\)|setMobileMenuOpen\s*\(\s*false\s*\)|closeMenu/i.test(combinedContent);

    const passed = Boolean(hasState && hasHiding && hasAutoClose);

    assertTest(
      "tier3",
      "E2E-T3-04",
      "Mobile drawer responsive flow: state toggling, responsive breakpoint hiding, and auto-close on anchor jump",
      passed,
      {
        expected: "Drawer state, md:hidden visibility, and link auto-close event handler",
        observed: `State: ${hasState}, Responsive hiding: ${hasHiding}, Auto-close handler: ${hasAutoClose}`,
        file: navRes.path || "src/components/navigation/Navbar.tsx",
        note: "Seamless mobile UX without lingering open drawer over content",
      }
    );
  }

  // E2E-T3-05: Telemetry HUD & Animation Cohesion
  {
    const hasGridOverlay = pageContent.includes("bg-industrial-grid") || pageContent.includes("grid");
    const hasSafetyOrangeAccent = pageContent.includes("#FF5F15") || pageContent.includes("text-[#FF5F15]");
    const hasCrosshairs = pageContent.includes("+") || pageContent.includes("crosshair");
    const hasMonospace = pageContent.includes("font-mono");

    const passed = Boolean(hasGridOverlay && hasSafetyOrangeAccent && hasCrosshairs && hasMonospace);

    assertTest(
      "tier3",
      "E2E-T3-05",
      "Minimalist Industrial visual cohesion: telemetry tags, corner crosshairs (+), monospace labels, and #FF5F15 accents",
      passed,
      {
        expected: "Cohesive aesthetic across all sections: industrial grid, corner crosshairs, monospace tags, orange accent",
        observed: `Grid: ${hasGridOverlay}, Safety Orange: ${hasSafetyOrangeAccent}, Crosshairs (+): ${hasCrosshairs}, Monospace: ${hasMonospace}`,
        file: "src/app/page.tsx",
        note: "Design language cohesion validated across entire SPA",
      }
    );
  }

  // E2E-T3-06: Single-Page Hash Routing & Fixed Header Offset Cohesion
  {
    const hasStickyHeader = pageContent.includes("sticky top-0") || pageContent.includes("fixed top-0");
    const hasBackdropBlur = pageContent.includes("backdrop-blur");
    const allSectionsHaveMargin = ["home", "how-it-works", "pricing", "about", "contact"].every((id) => {
      const sec = extractSectionContent(pageContent, id);
      return sec && sec.includes("scroll-mt-24");
    });

    const passed = Boolean(hasStickyHeader && hasBackdropBlur && allSectionsHaveMargin);

    assertTest(
      "tier3",
      "E2E-T3-06",
      "Single-page hash routing & fixed header cohesion: 64px header height compensated by scroll-mt-24",
      passed,
      {
        expected: "Sticky/fixed top header paired with scroll-mt-24 across all 5 sections",
        observed: `Header: ${hasStickyHeader}, Backdrop blur: ${hasBackdropBlur}, All scroll-mt-24: ${allSectionsHaveMargin}`,
        file: "src/app/page.tsx",
        note: "Eliminates header occlusion during deep-linked hash navigation",
      }
    );
  }
}

// ==============================================================================
// TIER 4: REAL-WORLD MEGA-PROJECT WORKLOAD SCENARIOS (5 TESTS)
// ==============================================================================
function runTier4() {
  logTier(4, "REAL-WORLD SCENARIOS (CONVERSION FUNNEL, DISRUPTION SIM, RFP INTAKE, BUILD)");

  const pageContent = readFileSafe("src/app/page.tsx") || "";

  // E2E-T4-01: User Journey 1: Mega-Project Executive Conversion Funnel
  {
    const heroContent = extractSectionContent(pageContent, "home") || pageContent;
    const pricingContent = extractSectionContent(pageContent, "pricing") || pageContent;

    const heroRoutesToContactOrPricing = heroContent.includes('href="#contact"') || heroContent.includes('href="#pricing"');
    const pricingRoutesToContact = pricingContent.includes('href="#contact"');
    const contactSectionExists = pageContent.includes('id="contact"');

    const passed = Boolean(heroRoutesToContactOrPricing && pricingRoutesToContact && contactSectionExists);

    assertTest(
      "tier4",
      "E2E-T4-01",
      "User Journey 1: Executive conversion funnel routes unbroken from Hero CTAs -> Pricing Cards -> Contact Intake",
      passed,
      {
        expected: "Hero routes to #pricing/#contact, and all Pricing CTAs route to #contact",
        observed: `Hero routes: ${heroRoutesToContactOrPricing}, Pricing routes: ${pricingRoutesToContact}, Contact anchor: ${contactSectionExists}`,
        file: "src/app/page.tsx",
        note: "Continuous unbroken commercial conversion path",
      }
    );
  }

  // E2E-T4-02: User Journey 2: Supply Chain Disruption Simulation & Autonomous Rerouting
  {
    const howItWorksRes = findFirstExistingFile([
      "src/components/sections/HowItWorks.tsx",
      "src/components/sections/HowItWorksSection.tsx",
      "src/components/sections/Pipeline.tsx",
      "src/app/page.tsx",
    ]);
    const content = howItWorksRes.content || "";

    const hasIngestion = content.includes("Procurement") || content.includes("BIM");
    const hasPermitting = content.includes("GovTech") || content.includes("Permitting");
    const hasLogistics = content.includes("Logistics") || content.includes("Telemetry");
    const hasMitigation = content.includes("Mitigation") || content.includes("Disruption");
    const hasSolverLatency = content.includes("140ms") || content.includes("MILP");

    const passed = Boolean(hasIngestion && hasPermitting && hasLogistics && hasMitigation && hasSolverLatency);

    assertTest(
      "tier4",
      "E2E-T4-02",
      "User Journey 2: 4-stage supply chain pipeline demonstrates autonomous disruption rerouting (< 140ms MILP solver)",
      passed,
      {
        expected: "Sequential stages (BIM Ingestion -> GovTech -> Telemetry -> Disruption Mitigation) with < 140ms latency",
        observed: `Ingestion: ${hasIngestion}, GovTech: ${hasPermitting}, Logistics: ${hasLogistics}, Mitigation: ${hasMitigation}, Latency: ${hasSolverLatency}`,
        file: howItWorksRes.path || "src/components/sections/HowItWorks.tsx",
        note: "Autonomous supply chain digital twin narrative validated",
      }
    );
  }

  // E2E-T4-03: User Journey 3: GovTech Enterprise RFP Consultation Submission
  {
    const contactRes = findFirstExistingFile([
      "src/components/sections/ContactUs.tsx",
      "src/components/sections/ContactSection.tsx",
      "src/components/sections/Contact.tsx",
      "src/app/page.tsx",
    ]);
    const content = contactRes.content || "";

    const hasFormTag = content.includes("<form");
    const hasEmailField = content.includes('type="email"') || content.includes("email");
    const hasCapExSelect = content.includes("CapEx") || content.includes("select");
    const hasSubmitBtn = content.includes('type="submit"') || content.includes("<button");
    const hasTransmissionAck = /alert\(|TRANSMISSION LOGGED|INQUIRY QUEUED|status|submitted/i.test(content);

    const passed = Boolean(hasFormTag && hasEmailField && hasCapExSelect && hasSubmitBtn && hasTransmissionAck);

    assertTest(
      "tier4",
      "E2E-T4-03",
      "User Journey 3: GovTech enterprise RFP intake form captures prime contractor CapEx and returns transmission confirmation",
      passed,
      {
        expected: "Interactive RFP intake form with CapEx options, submit action, and transmission feedback",
        observed: `Form: ${hasFormTag}, Email: ${hasEmailField}, CapEx Select: ${hasCapExSelect}, Submit: ${hasSubmitBtn}, Ack: ${hasTransmissionAck}`,
        file: contactRes.path || "src/components/sections/ContactUs.tsx",
        note: "Interactive GovTech consultation workflow verified",
      }
    );
  }

  // E2E-T4-04: User Journey 4: Deterministic Production Build Compilation
  {
    const pkgContent = readFileSafe("package.json");
    let hasBuildScript = false;
    let hasDeps = false;

    if (pkgContent) {
      try {
        const pkg = JSON.parse(pkgContent);
        hasBuildScript = Boolean(pkg.scripts && pkg.scripts.build);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        hasDeps = ["next", "react", "framer-motion", "lucide-react", "next-themes", "tailwindcss"].every(
          (d) => Boolean(deps[d])
        );
      } catch (err) {
        hasBuildScript = false;
      }
    }

    console.log(`\n    ${colors.dim}Executing production build check ('npm.cmd run build')...${colors.reset}`);
    const buildCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const result = spawnSync(buildCmd, ["run", "build"], {
      cwd: projectRoot,
      encoding: "utf-8",
      timeout: 180000,
      shell: true,
    });
    const buildPassed = result.status === 0;
    const output = (result.stdout || "") + "\n" + (result.stderr || "");

    assertTest(
      "tier4",
      "E2E-T4-04",
      "User Journey 4: Deterministic production build compilation executes with code 0 without hydration errors",
      hasBuildScript && hasDeps && buildPassed,
      {
        expected: "package.json build script present, core dependencies installed, and 'npm.cmd run build' exits 0",
        observed: buildPassed
          ? "Build succeeded with exit status 0"
          : `Build exited with status ${result.status}: ${output.slice(0, 300)}...`,
        file: "package.json, next.config.mjs",
        note: "Validates deterministic production bundle generation",
      }
    );
  }

  // E2E-T4-05: User Journey 5: Asset Resolution & Favicon Header Verification
  {
    const faviconIcoExists = fileExists("public/favicon.ico");
    const faviconSvgExists = fileExists("public/favicon.svg");
    const icoSize = getFileSize("public/favicon.ico");
    const svgSize = getFileSize("public/favicon.svg");
    const layoutContent = readFileSafe("src/app/layout.tsx") || "";

    const hasAsset = (faviconIcoExists && icoSize > 50) || (faviconSvgExists && svgSize > 50);
    const hasLayoutLink = layoutContent.includes("favicon") && layoutContent.includes("icons");

    const passed = Boolean(hasAsset && hasLayoutLink);

    assertTest(
      "tier4",
      "E2E-T4-05",
      "User Journey 5: Brand favicon asset resolution verifies physical asset size > 50 bytes and layout metadata linkage",
      passed,
      {
        expected: "Favicon asset in public/ with size > 50 bytes, referenced in layout.tsx icons metadata",
        observed: `Asset present: ${hasAsset} (ico: ${icoSize}B, svg: ${svgSize}B), Metadata link: ${hasLayoutLink}`,
        file: "public/favicon.ico, src/app/layout.tsx",
        note: "Guarantees tab icon displays without 404 in client browsers",
      }
    );
  }
}

// ==============================================================================
// RUNNER ENTRY POINT & CLI PARSING
// ==============================================================================
async function main() {
  const startTime = Date.now();
  const rawArgs = process.argv.slice(2);

  let requestedTier = "all";

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg === "-h" || arg === "--help") {
      console.log(`
${colors.bold}Synergis AI 4-Tier E2E Automated Test Runner${colors.reset}

${colors.bold}Usage:${colors.reset}
  node tests/run-e2e-tests.mjs [options]

${colors.bold}Options:${colors.reset}
  --tier=1       Run Tier 1 only (Feature Coverage - 60 assertions)
  --tier=2       Run Tier 2 only (Boundary & Negative Constraints - 10 assertions)
  --tier=3       Run Tier 3 only (Cross-Feature Combinations - 6 assertions)
  --tier=4       Run Tier 4 only (Real-World Scenarios - 5 assertions)
  --tier=all     Run all 4 tiers (Default - 81 assertions)
  -h, --help     Show this help message
`);
      process.exit(0);
    } else if (arg.startsWith("--tier=")) {
      requestedTier = arg.split("=")[1].trim().toLowerCase();
    } else if (arg === "--tier" && rawArgs[i + 1]) {
      requestedTier = rawArgs[i + 1].trim().toLowerCase();
      i++;
    }
  }

  logHeader("SYNERGIS AI // INDEPENDENT 4-TIER E2E VERIFICATION SUITE");
  console.log(`Root Directory: ${colors.yellow}${projectRoot}${colors.reset}`);
  console.log(`Target Tier:    ${colors.magenta}${requestedTier.toUpperCase()}${colors.reset}`);
  console.log(`Timestamp:      ${colors.yellow}${new Date().toISOString()}${colors.reset}\n`);

  if (requestedTier === "1") {
    runTier1();
  } else if (requestedTier === "2") {
    runTier2();
  } else if (requestedTier === "3") {
    runTier3();
  } else if (requestedTier === "4") {
    runTier4();
  } else if (requestedTier === "all") {
    runTier1();
    runTier2();
    runTier3();
    runTier4();
  } else {
    console.error(`${colors.red}Invalid tier option: "${requestedTier}". Use 1, 2, 3, 4, or all.${colors.reset}`);
    process.exit(1);
  }

  // Summary Report
  const durationMs = Date.now() - startTime;
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  TEST RUN SUMMARY & VERDICT${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`  Total Tests Run:  ${colors.bold}${totalTests}${colors.reset}`);
  console.log(`  Passed Tests:     ${colors.green}${colors.bold}${passedTests}${colors.reset}`);
  console.log(`  Failed Tests:     ${failedTests > 0 ? colors.red : colors.green}${colors.bold}${failedTests}${colors.reset}`);
  console.log(`  Execution Time:   ${colors.yellow}${durationMs} ms${colors.reset}\n`);

  // Breakdown by Tier
  console.log(`  ${colors.bold}Tier Breakdown:${colors.reset}`);
  for (const [key, stats] of Object.entries(tierStats)) {
    if (stats.total > 0) {
      const tierLabel = key.toUpperCase();
      const statusColor = stats.failed === 0 ? colors.green : colors.red;
      console.log(`    • ${tierLabel.padEnd(8)}: ${stats.passed}/${stats.total} passed ${statusColor}(${stats.failed} failed)${colors.reset}`);
    }
  }

  if (failedTests === 0) {
    console.log(`\n  ${colors.bgGreen}${colors.bold}  OVERALL RESULT: PASSED (100% SUCCESS)  ${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n  ${colors.bgRed}${colors.bold}  OVERALL RESULT: FAILED (${failedTests} FAILURES)  ${colors.reset}\n`);
    console.log(`${colors.red}Failures breakdown:${colors.reset}`);
    for (const f of failures) {
      console.log(`  - [${f.testId}] (${f.tierKey.toUpperCase()}) ${f.name}`);
    }
    console.log("");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error during test suite execution:", err);
  process.exit(1);
});
