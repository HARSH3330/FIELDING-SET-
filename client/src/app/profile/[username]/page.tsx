"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Flame } from 'lucide-react';

export default function ProfilePage() {
  const { username } = useParams();

  // Fetch user's posts using the new username filter endpoint
  const { data, isLoading, error } = useQuery({
    queryKey: ['userPosts', username],
    queryFn: async () => {
      const res = await api.get(`/posts?username=${username}&limit=100`);
      return res.data;
    },
    enabled: !!username,
  });

  const posts = data?.posts ?? [];

  if (isLoading) return (
    <div className="max-w-xl mx-auto space-y-6 mt-8">
      <div className="flex items-center gap-6 p-6 border border-zinc-800 rounded-xl bg-[#161616]">
        <Skeleton className="h-24 w-24 rounded-full bg-zinc-800" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <Skeleton className="h-4 w-48 bg-zinc-800" />
        </div>
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl bg-zinc-800" />
    </div>
  );

  if (error) return (
    <div className="text-center p-12 text-zinc-400">Error loading profile.</div>
  );

  const userInfo = posts.length > 0 ? posts[0].user : { username, avatarUrl: '' };
  const totalReactions = posts.reduce((acc: number, post: any) => acc + (post._count?.reactions ?? 0), 0);

  return (
    <div className="max-w-xl mx-auto pb-20 page-enter">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 border border-zinc-800 bg-[#161616] rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
        <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-zinc-800 ring-2 ring-[#22c55e]/30">
          <AvatarImage src={userInfo.avatarUrl || ''} />
          <AvatarFallback className="bg-zinc-800 text-3xl font-black text-white">
            {String(userInfo.username ?? 'U').substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-3xl font-black text-white">@{username}</h1>
          <p className="text-sm text-zinc-500 mt-1">Fielding Set Operator</p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
            <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-900/70 px-3 py-1.5 rounded-full text-sm border border-zinc-800">
              <MessageSquare className="h-4 w-4" />
              <span className="font-bold text-white">{posts.length}</span>
              <span>Posts</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-900/70 px-3 py-1.5 rounded-full text-sm border border-zinc-800">
              <Flame className="h-4 w-4 text-[#22c55e]" />
              <span className="font-bold text-white">{totalReactions}</span>
              <span>Reactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts heading */}
      <div className="mb-5 flex items-center gap-3 border-b border-zinc-800 pb-3">
        <h2 className="text-lg font-black uppercase tracking-widest text-zinc-300">Declarations</h2>
        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{posts.length}</span>
      </div>

      {/* Posts */}
      <div>
        {posts.length === 0 ? (
          <div className="text-center py-24 border border-zinc-800 border-dashed rounded-xl">
            <p className="text-zinc-500">No Fielding Sets declared yet.</p>
          </div>
        ) : (
          posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
