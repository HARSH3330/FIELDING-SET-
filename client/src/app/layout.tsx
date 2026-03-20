import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fielding Set — Meme Social Platform",
  description: "Upload photos. Declare someone FIELDING SET. Purely for fun and sarcasm.",
  openGraph: {
    title: "Fielding Set",
    description: "Declare someone Fielding Set. The internet's loudest sarcasm outlet.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0f0f0f] text-white antialiased`}>
        {/* Animated background grid */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          {/* Floating glow blobs */}
          <div className="animate-blob absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#22c55e]/5 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-[#22c55e]/5 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#22c55e]/4 blur-3xl" />
          
          {/* Radial vignette to keep edges dark */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0f0f0f_100%)]" />
        </div>

        <ReactQueryProvider>
          <Navbar />
          <main className="container flex-1 mx-auto max-w-5xl px-4 py-8">
            {children}
          </main>
          <footer className="w-full border-t border-zinc-800/60 bg-[#0a0a0a] py-6 text-center text-sm text-zinc-500">
            <p>⚠️ Disclaimer: This website is purely for fun and sarcasm. Don't take it seriously.</p>
            <p className="mt-1 text-xs text-zinc-600">© {new Date().getFullYear()} Fielding Set Platform. All rights reserved.</p>
          </footer>
          <Toaster theme="dark" position="bottom-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
