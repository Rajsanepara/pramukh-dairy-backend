import express from 'express';
import {
  upsertPaymentStatus,
  getPaymentStatus
} from '../controllers/paymentController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authRequired);

router.get('/', getPaymentStatus);
router.put('/', upsertPaymentStatus);

export default router;

