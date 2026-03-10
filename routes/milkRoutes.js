import express from 'express';
import {
  getDailyMilk,
  upsertMilkEntry,
  getClientMonthlyMilk
} from '../controllers/milkController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authRequired);

router.get('/client-monthly/:clientId', getClientMonthlyMilk);
router.get('/', getDailyMilk);
router.put('/', upsertMilkEntry);

export default router;

