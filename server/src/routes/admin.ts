import express from 'express';
import { getFlags, banUser, isAdmin } from '../controllers/admin';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/flags', authenticate, isAdmin, getFlags);
router.post('/users/:id/ban', authenticate, isAdmin, banUser);

export default router;
