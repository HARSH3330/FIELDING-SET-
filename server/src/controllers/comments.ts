import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const commentSchema = z.object({
  postId: z.number().int().positive(),
  content: z.string().min(1).max(500),
});

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
export const getCommentsConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = parseInt(req.params.postId as string);
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } }
      }
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, content } = commentSchema.parse(req.body);

    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: req.user.id,
        content
      },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({ where: { id: parseInt(id as string) } });

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    if (comment.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    await prisma.comment.delete({ where: { id: parseInt(id as string) } });

    res.json({ message: 'Comment removed' });
  } catch (error) {
    next(error);
  }
};
