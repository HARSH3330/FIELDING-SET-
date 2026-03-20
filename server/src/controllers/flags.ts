import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const flagSchema = z.object({
  postId: z.number().int().positive().optional(),
  userId: z.number().int().positive().optional(),
  reason: z.string().min(1).max(500),
});

// @desc    Report/Flag a post or user
// @route   POST /api/flags
// @access  Private
export const createFlag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, userId, reason } = flagSchema.parse(req.body);

    if (!postId && !userId) {
      res.status(400);
      throw new Error('Must flag either a post or a user');
    }

    const flag = await prisma.flag.create({
      data: {
        postId,
        userId: userId || null, // in case it was explicitly passed as undefined
        reason,
      }
    });

    res.status(201).json(flag);
  } catch (error) {
    next(error);
  }
};
