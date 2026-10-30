import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export const metadata: Metadata = {
  title: "Synergis AI — Autonomous Supply Chain Control Tower",
  description:
    "Autonomous supply chain control tower for mega-projects. Synthesizing multi-tier procurement, BIM LOD 400 schedules, GovTech permitting, and multimodal logistics with sub-140ms disruption mitigation.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className="font-sans font-mono antialiased bg-[#F8F9FA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 min-h-screen selection:bg-[#FF5F15] selection:text-white"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
