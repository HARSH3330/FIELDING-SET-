"use client";

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { usePathname, useRouter } from 'next/navigation';
import { Button, buttonVariants } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut, Upload, User as UserIcon } from 'lucide-react';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // Validate state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#0f0f0f]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black italic tracking-tighter text-[#22c55e]">
            FIELDING SET
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/feed" className={`transition-colors hover:text-white ${pathname === '/feed' ? 'text-white' : ''}`}>
            Feed
          </Link>
          <Link href="/top" className={`transition-colors hover:text-white ${pathname === '/top' ? 'text-white' : ''}`}>
            Top
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link 
                href="/upload" 
                className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:flex border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white" })}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-8 w-8 rounded-full border border-zinc-700 bg-transparent hover:bg-zinc-800 cursor-pointer outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl || ''} alt={user?.username} />
                      <AvatarFallback className="bg-zinc-800 text-xs text-white">
                        {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#161616] border-zinc-800 text-white" align="end" sideOffset={8}>
                  <DropdownMenuItem onClick={() => router.push(`/profile/${user?.username}`)} className="cursor-pointer focus:bg-zinc-800 focus:text-white">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 focus:bg-zinc-800 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link 
                href="/sign-in" 
                className={buttonVariants({ variant: "ghost", size: "sm", className: "text-zinc-300 hover:text-white hover:bg-zinc-800" })}
              >
                Log in
              </Link>
              <Link 
                href="/sign-up" 
                className={buttonVariants({ size: "sm", className: "bg-[#22c55e] text-black hover:bg-[#22c55e]/90 font-bold" })}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
