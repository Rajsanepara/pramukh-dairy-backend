import express from 'express';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  toggleClientActive
} from '../controllers/clientController.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authRequired);

router.get('/', getClients);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.patch('/:id/toggle-active', toggleClientActive);

export default router;

