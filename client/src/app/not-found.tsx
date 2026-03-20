import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center gap-6">
      <div className="space-y-2">
        <div className="-rotate-2 inline-block border-4 border-[#22c55e] px-6 py-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <h1 className="text-6xl font-black italic tracking-widest text-[#22c55e]">
            404
          </h1>
        </div>
        <p className="text-xl font-bold text-white mt-4">Page Not Found</p>
        <p className="text-zinc-500">This sector doesn't exist. Stand by.</p>
      </div>
      <Link 
  href="/" 
  className="bg-[#22c55e] text-black hover:bg-[#22c55e]/90 font-bold px-4 py-2 rounded flex items-center gap-2"
>
        <Home className="h-4 w-4" />
        Return to Base
      </Link>
    </div>
  );
}
