import express from 'express';
import { createFlag } from '../controllers/flags';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createFlag);

export default router;
