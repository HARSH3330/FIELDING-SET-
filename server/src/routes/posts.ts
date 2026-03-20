import express from 'express';
import { getPosts, getPostById, createPost, deletePost } from '../controllers/posts';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
// Support multipart form data with image field named 'image'
router.post('/', authenticate, upload.single('image'), createPost);
router.delete('/:id', authenticate, deletePost);

export default router;
