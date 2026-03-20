"use client";

import Link from 'next/link';
import { MessageSquare, Share2, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button, buttonVariants } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';
import ReactionBar from './ReactionBar';

interface PostCardProps {
  post: {
    id: number;
    name: string;
    imageUrl: string;
    caption?: string;
    score: number;
    createdAt?: string;
    user: { id: number; username: string; avatarUrl?: string };
    _count: { comments: number; reactions: number };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [copied, setCopied] = useState(false);
  
  const imgSource = post.imageUrl?.startsWith('http') 
    ? post.imageUrl 
    : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${post.imageUrl}`;

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Card className="mb-6 overflow-hidden border-zinc-800 bg-[#161616] text-white transition-all hover:border-zinc-700">
      {/* Post Header — who posted */}
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.user.username}`}>
            <Avatar className="h-8 w-8 outline outline-2 outline-zinc-700 hover:outline-[#22c55e] transition-all">
              <AvatarImage src={post.user.avatarUrl || ''} />
              <AvatarFallback className="bg-zinc-800 text-xs font-bold">
                {post.user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link href={`/profile/${post.user.username}`} className="text-sm font-semibold hover:underline hover:text-[#22c55e] transition-colors">
              {post.user.username}
            </Link>
            {post.createdAt && (
              <span className="text-xs text-zinc-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      {/* WANTED POSTER LAYOUT */}
      <CardContent className="p-0">
        <Link href={`/post/${post.id}`} className="block">
          {/* The Photo — full width, no overlay */}
          <div className="w-full bg-black flex items-center justify-center overflow-hidden" style={{ minHeight: '280px', maxHeight: '550px' }}>
            <img 
              src={imgSource} 
              alt={post.name} 
              className="w-full object-contain max-h-[550px]"
              loading="lazy"
            />
          </div>

          {/* WANTED POSTER FOOTER — Name + FIELDING SET stamp below the image */}
          <div className="bg-[#0d0d0d] border-t-4 border-[#22c55e] px-4 py-5 text-center">
            {/* Name in large bold text */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              {post.name}
            </h2>
            
            {/* FIELDING SET stamp */}
            <div className="mt-3 inline-block -rotate-1 border-[3px] border-[#22c55e] px-5 py-1.5 shadow-[0_0_15px_rgba(34,197,94,0.35)]">
              <span className="text-xl sm:text-2xl font-black italic tracking-[0.2em] text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                FIELDING SET
              </span>
            </div>
          </div>
        </Link>

        {/* Caption */}
        {post.caption && (
          <div className="px-4 py-3 text-sm text-zinc-300 border-t border-zinc-800/50">
            {post.caption}
          </div>
        )}
      </CardContent>

      {/* Actions Footer */}
      <CardFooter className="px-4 py-3 border-t border-zinc-800 flex flex-col items-start gap-3">
        <div className="w-full">
          <ReactionBar postId={post.id} initialCounts={{}} />
        </div>
        
        <div className="flex items-center justify-between w-full text-zinc-400">
          <Link 
            href={`/post/${post.id}`} 
            className={buttonVariants({ variant: "ghost", size: "sm", className: "hover:bg-zinc-800 hover:text-white gap-2" })}
          >
            <MessageSquare className="h-4 w-4" />
            {post._count.comments} Comments
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-zinc-800 hover:text-white gap-2"
            onClick={handleShare}
          >
            {copied ? <Check className="h-4 w-4 text-[#22c55e]" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
