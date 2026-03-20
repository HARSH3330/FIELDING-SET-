"use client";

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, Flame, Image as ImageIcon, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[85vh]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-8 py-24 text-center">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-block -rotate-2 border-4 border-[#22c55e] px-6 py-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] mb-4 bg-[#0a0a0a]">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-widest text-[#22c55e] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              FIELDING SET
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-medium text-zinc-300">
            Upload a photo. Declare it Fielding Set. Stand By.
          </p>
          <p className="text-indigo-400 font-medium text-sm">
            Disclaimer: This website is purely for fun and sarcasm. Please do not take it seriously.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <Link href="/feed" className={buttonVariants({ size: "lg", className: "h-14 bg-[#22c55e] text-black hover:bg-[#22c55e]/90 text-lg font-bold" })}>
            View Feed <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link href="/upload" className={buttonVariants({ size: "lg", variant: "outline", className: "h-14 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white text-lg font-bold" })}>
            Upload Photo
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24 pt-12 px-4 max-w-5xl mx-auto border-t border-zinc-800 mt-auto">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-[#22c55e]">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Upload Memes</h3>
          <p className="text-zinc-400">Share the finest, out-of-pocket moments from around the world.</p>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-[#22c55e]">
            <Flame className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Declare Status</h3>
          <p className="text-zinc-400">Squad Ready? Standing By? React to drops with the official designations.</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-[#22c55e]">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Join the Unit</h3>
          <p className="text-zinc-400">Build your profile, gather reactions, and climb the Top charts.</p>
        </div>
      </section>
    </div>
  );
}
