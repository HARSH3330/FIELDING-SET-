import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';

const createPostSchema = z.object({
  name: z.string().min(1).max(100),
  caption: z.string().optional(),
  imageUrl: z.string().url().optional(), // In case passed directly instead of uploaded
});

// @desc    Get all posts (Feed)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || 'trending';
    const username = req.query.username as string | undefined;
    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: 'desc' }; // default 'new'
    if (sort === 'top') {
      orderBy = { score: 'desc' };
    } else if (sort === 'trending') {
      // Simplistic trending: combination of fresh and score
      orderBy = [{ score: 'desc' }, { createdAt: 'desc' }];
    }

    const where = username ? { user: { username } } : {};

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { comments: true, reactions: true } }
      }
    });

    const total = await prisma.post.count({ where });

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { comments: true, reactions: true } }
      }
    });

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If a file was uploaded via multer, use that path
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      // Return relative path starting with /uploads/
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      res.status(400);
      throw new Error('Image is required');
    }

    const { name, caption } = createPostSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        name,
        caption,
        imageUrl,
      },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id: parseInt(id as string) } });

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check if user is the author or admin (we assume simple check here)
    if (post.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }

    await prisma.post.delete({ where: { id: parseInt(id as string) } });

    res.json({ message: 'Post removed' });
  } catch (error) {
    next(error);
  }
};
