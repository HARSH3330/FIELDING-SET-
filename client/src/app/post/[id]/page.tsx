"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { ArrowLeft, MessageSquare, MoreHorizontal, AlertTriangle, Trash2, Share2, Check } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function PostDetailPage() {
  const params = useParams();
  const postId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error('Failed to copy link'); }
  };

  // Fetch Post
  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}`);
      return res.data;
    },
    enabled: !!postId,
  });

  // Fetch Comments
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await api.get(`/comments/${postId}`);
      return res.data;
    },
    enabled: !!postId,
  });

  // Add Comment
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post('/comments', { postId: parseInt(postId), content });
      return res.data;
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      toast.success('Comment added');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    }
  });

  // Delete Post
  const deletePostMutation = useMutation({
    mutationFn: async () => { await api.delete(`/posts/${postId}`); },
    onSuccess: () => { toast.success('Post deleted'); router.push('/feed'); },
    onError: () => toast.error('Failed to delete post')
  });

  // Delete Comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => { await api.delete(`/comments/${commentId}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      toast.success('Comment deleted');
    }
  });

  // Flag Post
  const handleFlag = async () => {
    if (!isAuthenticated) { toast.error('Please log in to flag content'); return; }
    try {
      await api.post('/flags', { postId: parseInt(postId), reason: 'Inappropriate content' });
      toast.success('Post reported');
    } catch { toast.error('Failed to report'); }
  };

  if (postLoading) return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-[500px] w-full bg-zinc-800 rounded-xl" />
      <Skeleton className="h-20 w-full bg-zinc-800 rounded-xl" />
    </div>
  );

  if (postError || !post) return (
    <div className="text-center p-12 text-zinc-400">
      <p>Post not found.</p>
      <Link href="/feed" className={buttonVariants({ variant: "outline", className: "mt-4 border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700" })}>
        Return to Feed
      </Link>
    </div>
  );

  const isAuthor = user?.id === post.userId;

  return (
    <div className="max-w-2xl mx-auto pb-20 page-enter">
      {/* Back nav */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/feed" className={buttonVariants({ variant: "ghost", size: "sm", className: "text-zinc-400 hover:text-white gap-2" })}>
          <ArrowLeft className="h-4 w-4" /> Back to Feed
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white gap-2" onClick={handleShare}>
            {copied ? <Check className="h-4 w-4 text-[#22c55e]" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer outline-none">
                <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#161616] border-zinc-800 text-zinc-300">
              {isAuthor && (
                <DropdownMenuItem onClick={() => deletePostMutation.mutate()} className="text-red-400 focus:text-red-400 focus:bg-zinc-800 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                </DropdownMenuItem>
              )}
              {!isAuthor && (
                <DropdownMenuItem onClick={handleFlag} className="focus:bg-zinc-800 cursor-pointer">
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" /> Report Post
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Post Card */}
      <PostCard post={post} />

      {/* Comments Section */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-[#161616] overflow-hidden">
        <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-zinc-400" />
          <h3 className="font-bold text-white">Comments ({post._count?.comments ?? 0})</h3>
        </div>

        {/* Add Comment */}
        <div className="p-4 border-b border-zinc-800">
          <form onSubmit={(e) => { e.preventDefault(); if (commentText.trim() && isAuthenticated) addCommentMutation.mutate(commentText); }} className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0 mt-1">
              <AvatarImage src={user?.avatarUrl || ''} />
              <AvatarFallback className="bg-zinc-800 text-xs">{user ? user.username.substring(0, 2).toUpperCase() : '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment"}
                disabled={!isAuthenticated || addCommentMutation.isPending}
                className="resize-none border-zinc-700 bg-zinc-900 text-white flex-1 h-10 min-h-[40px]"
                rows={1}
              />
              <Button 
                type="submit" 
                disabled={!isAuthenticated || !commentText.trim() || addCommentMutation.isPending}
                className="bg-[#22c55e] text-black font-semibold hover:bg-[#22c55e]/90 shrink-0"
                size="sm"
              >
                Post
              </Button>
            </div>
          </form>
        </div>

        {/* Comment List */}
        <div className="divide-y divide-zinc-800">
          {commentsLoading ? (
            <div className="p-8 text-center text-sm text-zinc-500">Loading comments...</div>
          ) : !comments || comments.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">No comments yet. Be the first!</div>
          ) : (
            comments.map((comment: any) => (
              <div key={comment.id} className="p-4 flex gap-3 hover:bg-zinc-900/30 transition-colors">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={comment.user?.avatarUrl || ''} />
                  <AvatarFallback className="bg-zinc-800 text-xs">{comment.user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/profile/${comment.user?.username}`} className="font-semibold text-sm hover:underline text-zinc-200">
                        {comment.user?.username}
                      </Link>
                      <span className="text-xs text-zinc-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {user?.id === comment.userId && (
                      <button onClick={() => deleteCommentMutation.mutate(comment.id)} className="text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-zinc-300 mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
