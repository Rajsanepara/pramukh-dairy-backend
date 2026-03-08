import express from 'express';
import { getClientMonthlyBill } from '../controllers/billingController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authRequired);

router.get('/client/:clientId', getClientMonthlyBill);

export default router;

