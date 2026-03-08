import express from 'express';
import { getMonthlySummary } from '../controllers/analyticsController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authRequired);

router.get('/monthly', getMonthlySummary);

export default router;

