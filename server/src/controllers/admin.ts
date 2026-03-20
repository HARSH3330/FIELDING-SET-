import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

// Simple admin check based on a "role" field or simply an environment variable for now,
// or we can attach an isAdmin array of emails. For simplicity, let's assume any logged-in user 
// could theoretically be verified here. Since the schema doesn't have a role, we'll verify by email 
// against a config list or just allow if authenticated for MVP. Let's create an `isAdmin` middleware snippet.
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
    next();
  } else {
    // For local dev, we might just allow it or rely on a standard token
    if (process.env.NODE_ENV !== 'production') {
      next();
    } else {
      res.status(403);
      next(new Error('Not authorized as an admin'));
    }
  }
};

// @desc    Get all flagged content
// @route   GET /api/admin/flags
// @access  Private/Admin
export const getFlags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flags = await prisma.flag.findMany({
      include: {
        post: true,
        user: { select: { id: true, username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(flags);
  } catch (error) {
    next(error);
  }
};

// @desc    Ban User
// @route   POST /api/admin/users/:id/ban
// @access  Private/Admin
export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // In our schema we don't have isBanned, so we'll just delete the user or update a flag.
    // For MVP according to schema.sql, we can just delete.
    await prisma.user.delete({ where: { id: parseInt(id as string) } });
    
    res.json({ message: 'User banned and removed' });
  } catch (error) {
    next(error);
  }
};
