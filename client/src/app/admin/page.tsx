"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { ShieldAlert, Trash2, Ban } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, router]);

  const { data: flags, isLoading: flagsLoading } = useQuery({
    queryKey: ['admin-flags'],
    queryFn: async () => {
      const res = await api.get('/admin/flags');
      return res.data;
    },
    enabled: isAuthenticated,
  });

  const banUserMutation = useMutation({
    mutationFn: async (userId: number) => { await api.post(`/admin/users/${userId}/ban`); },
    onSuccess: () => {
      toast.success('User banned');
      queryClient.invalidateQueries({ queryKey: ['admin-flags'] });
    },
    onError: () => toast.error('Failed to ban user')
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => { await api.delete(`/posts/${postId}`); },
    onSuccess: () => {
      toast.success('Post removed');
      queryClient.invalidateQueries({ queryKey: ['admin-flags'] });
    },
    onError: () => toast.error('Failed to remove post')
  });

  if (!user) return null;

  const postFlags = flags?.filter((f: any) => f.postId) ?? [];
  const userFlags = flags?.filter((f: any) => f.userId && !f.postId) ?? [];

  return (
    <div className="max-w-4xl mx-auto pb-20 page-enter">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#22c55e] text-black shrink-0">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black italic tracking-wide text-white">MODERATOR COMMAND</h1>
          <p className="text-sm text-zinc-400">Review flagged content and manage platform safety.</p>
        </div>
      </div>

      <Tabs defaultValue="flags">
        <TabsList className="w-full justify-start bg-zinc-900 border border-zinc-800 rounded-lg p-1 h-auto mb-6">
          <TabsTrigger value="flags" className="data-[state=active]:bg-[#22c55e] data-[state=active]:text-black font-semibold py-2">
            Flagged Posts {postFlags.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{postFlags.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-[#22c55e] data-[state=active]:text-black font-semibold py-2">
            Reported Users {userFlags.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{userFlags.length}</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flags" className="space-y-4">
          {flagsLoading ? (
            <div className="text-center p-8 text-zinc-500">Loading reports...</div>
          ) : postFlags.length === 0 ? (
            <Card className="bg-[#161616] border-zinc-800">
              <CardContent className="p-12 text-center text-zinc-500">No active post reports. Sector is clear. ✓</CardContent>
            </Card>
          ) : (
            postFlags.map((flag: any) => (
              <Card key={flag.id} className="bg-[#161616] border-zinc-800 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">Flagged Post #{flag.postId}</CardTitle>
                      <CardDescription className="text-zinc-400 mt-1">
                        Reason: <span className="text-yellow-400">"{flag.reason}"</span>
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => deletePostMutation.mutate(flag.postId)} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50 shrink-0">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardHeader>
                {flag.post && (
                  <CardContent className="pt-0">
                    <div className="bg-zinc-900 rounded-md p-3 flex gap-3 text-sm">
                      {flag.post.imageUrl && (
                        <img 
                          src={flag.post.imageUrl.startsWith('http') ? flag.post.imageUrl : `http://localhost:4000${flag.post.imageUrl}`}
                          className="h-16 w-16 object-cover rounded shrink-0 bg-black" 
                          alt="thumbnail" 
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold">{flag.post.name}</p>
                        <p className="text-zinc-400 text-xs mt-0.5 line-clamp-2">{flag.post.caption}</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {flagsLoading ? (
            <div className="text-center p-8 text-zinc-500">Loading user reports...</div>
          ) : userFlags.length === 0 ? (
            <Card className="bg-[#161616] border-zinc-800">
              <CardContent className="p-12 text-center text-zinc-500">No active user reports. ✓</CardContent>
            </Card>
          ) : (
            userFlags.map((flag: any) => (
              <Card key={flag.id} className="bg-[#161616] border-zinc-800 text-white">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">Reported User <span className="text-[#22c55e]">@{flag.user?.username ?? `ID:${flag.userId}`}</span></CardTitle>
                      <CardDescription className="text-zinc-400 mt-1">
                        Reason: <span className="text-yellow-400">"{flag.reason}"</span>
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => banUserMutation.mutate(flag.userId)} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50 shrink-0">
                      <Ban className="h-4 w-4 mr-1" /> Ban
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
