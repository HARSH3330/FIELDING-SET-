"use client";

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ReactionBarProps {
  postId: number;
  initialCounts: Record<string, number>;
}

// Map the backend ENUM values to display text
const REACTION_TYPES = [
  { id: 'SQUAD_READY', label: 'Squad Ready', emoji: '😎' },
  { id: 'LOCATION_RECEIVED', label: 'Loc Received', emoji: '📍' },
  { id: 'STANDING_BY', label: 'Standing By', emoji: '🧍' },
  { id: 'WATCHING', label: 'Watching', emoji: '👀' },
];

export default function ReactionBar({ postId, initialCounts }: ReactionBarProps) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Local state for optimistic UI updates
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (type: string) => {
      const res = await api.post('/reactions', { postId, type });
      return res.data;
    },
    onMutate: (type) => {
      if (!isAuthenticated) {
        toast.error('You must be logged in to react');
        throw new Error('Not authenticated');
      }

      // Optimistic update
      const newCounts = { ...counts };
      
      // If toggling off
      if (activeReaction === type) {
        newCounts[type] = Math.max(0, (newCounts[type] || 0) - 1);
        setActiveReaction(null);
      } else {
        // If switching from another reaction
        if (activeReaction) {
          newCounts[activeReaction] = Math.max(0, (newCounts[activeReaction] || 0) - 1);
        }
        // Add new reaction
        newCounts[type] = (newCounts[type] || 0) + 1;
        setActiveReaction(type);
      }
      
      setCounts(newCounts);
    },
    onSettled: () => {
      // Invalidate queries to sync with backend
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
    onError: () => {
      toast.error('Failed to update reaction');
      // Revert in a real app would go here, we rely on invalidation
    }
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {REACTION_TYPES.map((reaction) => {
        const isActive = activeReaction === reaction.id;
        const count = counts[reaction.id] || 0;
        
        return (
          <button
            key={reaction.id}
            onClick={() => mutation.mutate(reaction.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all 
              ${isActive 
                ? 'bg-[#22c55e] text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700'
              }`}
          >
            <span className="text-sm">{reaction.emoji}</span>
            <span>{reaction.label}</span>
            {count > 0 && (
              <span className={`ml-1 rounded px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-black/20' : 'bg-black/40'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
