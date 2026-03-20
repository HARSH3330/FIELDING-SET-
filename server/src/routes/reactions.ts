import express from 'express';
import { getReactions, toggleReaction } from '../controllers/reactions';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/:postId', getReactions);
router.post('/', authenticate, toggleReaction);

export default router;
