import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { KeyModal } from "@/components/KeyModal";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const jbmono = JetBrains_Mono({ variable: "--font-jbmono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Opus 4.8 Lab · Learn & Build with Claude",
  description: "An interactive workshop for Claude Opus 4.8: learning modules, hands-on labs, industry use cases and a LangGraph AI coach (BYOK Groq).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className={`${jakarta.variable} ${jbmono.variable} h-full antialiased`}>
      <body className="bg-mesh flex min-h-full flex-col">
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <KeyModal />
          <footer className="border-t border-violet-100 py-6 text-center text-xs text-slate-500">
            Opus 4.8 Lab · Workshop companion · AI Coach powered by LangGraph + Groq (bring your own key)
          </footer>
        </Providers>
      </body>
    </html>
  );
}
