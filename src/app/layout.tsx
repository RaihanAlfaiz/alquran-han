import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";
import { BookmarkProvider } from "@/context/BookmarkContext";
import GlobalPlayer from "@/components/GlobalPlayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alquran-Han | Digital Quran by Raihan",
  description: "A modern, spiritual reading experience crafted by Raihan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${amiri.variable} antialiased selection:bg-sky-500/30 selection:text-sky-200`}
      >
        <AudioProvider>
          <BookmarkProvider>
            {/* Background Mesh */}
            <div
              className="fixed inset-0 z-[-1] opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.15), transparent 60%)",
              }}
            />

            {children}

            <GlobalPlayer />

            {/* BRANDING FOOTER */}
            <footer className="w-full py-8 text-center border-t border-white/5 mt-20 relative z-10 glass-panel border-x-0 rounded-none bg-black/20">
              <p className="text-white/40 text-sm font-light tracking-widest uppercase">
                Crafted with{" "}
                <span className="text-rose-500 animate-pulse">❤</span> by{" "}
                <span className="text-sky-400 font-bold">Raihan</span>
              </p>
              <p className="text-[10px] text-white/20 mt-2">
                © 2026 Alquran-Han. All Rights Reserved.
              </p>
            </footer>
          </BookmarkProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
