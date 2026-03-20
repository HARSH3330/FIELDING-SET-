"use client";

import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FeedPage() {
  const searchParams = useSearchParams();
  const initialSort = searchParams.get('sort') || 'trending';
  const [sort, setSort] = useState(initialSort);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async ({ pageParam = 1 }) => {
    const res = await api.get(`/posts?page=${pageParam}&limit=5&sort=${sort}`);
    return res.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: ['posts', sort],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="max-w-xl mx-auto pb-20 page-enter">
      {/* Sticky Sort Header */}
      <div className="flex items-center justify-between mb-6 sticky top-16 z-40 bg-[#0f0f0f]/90 py-4 backdrop-blur-sm">
        <h1 className="text-2xl font-black italic tracking-tight text-white">FEED</h1>
        <Tabs value={sort} onValueChange={setSort} className="w-auto">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="trending" className="data-[state=active]:bg-[#22c55e] data-[state=active]:text-black font-semibold text-xs sm:text-sm">Trending</TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-[#22c55e] data-[state=active]:text-black font-semibold text-xs sm:text-sm">New</TabsTrigger>
            <TabsTrigger value="top" className="data-[state=active]:bg-[#22c55e] data-[state=active]:text-black font-semibold text-xs sm:text-sm">Top</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Post List */}
      {status === 'pending' ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-[#161616] p-4 space-y-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-zinc-800" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px] bg-zinc-800" />
                  <Skeleton className="h-3 w-[100px] bg-zinc-800" />
                </div>
              </div>
              <Skeleton className="h-[400px] w-full rounded-md bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : status === 'error' ? (
        <div className="text-center p-8 bg-[#161616] border border-red-900/50 rounded-xl">
          <p className="text-red-400 font-medium">Could not connect to the server.</p>
          <p className="text-zinc-500 text-sm mt-1">Make sure the backend is running on port 4000.</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-zinc-800 rounded-md hover:bg-zinc-700 text-white text-sm">
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          {data?.pages.map((page, i) => (
            <div key={i}>
              {page?.posts?.length === 0 && i === 0 ? (
                <div className="text-center py-24 text-zinc-500 border border-zinc-800 border-dashed rounded-xl">
                  <p className="text-lg font-medium">No posts yet.</p>
                  <p className="text-sm mt-1">Be the first to declare someone Fielding Set!</p>
                </div>
              ) : (
                page?.posts?.map((post: any) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#22c55e]" />
        ) : hasNextPage ? (
          <span className="text-zinc-600 text-xs">Scroll for more</span>
        ) : (data?.pages[0]?.posts?.length ?? 0) > 0 ? (
          <span className="text-zinc-700 text-xs">— End of feed —</span>
        ) : null}
      </div>
    </div>
  );
}
