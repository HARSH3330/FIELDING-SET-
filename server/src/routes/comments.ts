import express from 'express';
import { getCommentsConfig, createComment, deleteComment } from '../controllers/comments';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/:postId', getCommentsConfig);
router.post('/', authenticate, createComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
