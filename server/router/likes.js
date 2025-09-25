import { Router } from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { getLikes, likeJob, unlikeJob } from '../controllers/likes.js';

const router = new Router();

router.get('/', checkAuth, getLikes);
router.post('/:jobId', checkAuth, likeJob);
router.delete('/:jobId', checkAuth, unlikeJob);

export default router;
