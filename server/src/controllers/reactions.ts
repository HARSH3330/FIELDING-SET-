import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const reactionSchema = z.object({
  postId: z.number().int().positive(),
  type: z.enum(['SQUAD_READY', 'LOCATION_RECEIVED', 'STANDING_BY', 'WATCHING']),
});

// @desc    Get reactions and counts for a post
// @route   GET /api/reactions/:postId
// @access  Public
export const getReactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = parseInt(req.params.postId as string);

    // Get aggregated counts
    const aggregation = await prisma.reaction.groupBy({
      by: ['reactionType'],
      where: { postId },
      _count: {
        reactionType: true
      }
    });

    const counts = aggregation.reduce((acc: Record<string, number>, curr: any) => {
      acc[curr.reactionType] = curr._count.reactionType;
      return acc;
    }, {} as Record<string, number>);

    res.json({ counts });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update a reaction (toggle)
// @route   POST /api/reactions
// @access  Private
export const toggleReaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, type } = reactionSchema.parse(req.body);
    const userId = req.user.id;

    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check if user already reacted
    const existing = await prisma.reaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        }
      }
    });

    if (existing) {
      if (existing.reactionType === type) {
        // Toggle OFF if same type
        await prisma.reaction.delete({ where: { id: existing.id } });
        return res.json({ message: 'Reaction removed' });
      } else {
        // Update type
        const updated = await prisma.reaction.update({
          where: { id: existing.id },
          data: { reactionType: type }
        });
        return res.json(updated);
      }
    }

    // New reaction
    const newReaction = await prisma.reaction.create({
      data: {
        postId,
        userId,
        reactionType: type
      }
    });

    res.status(201).json(newReaction);
  } catch (error) {
    next(error);
  }
};
