import { Router } from 'express';
import { increaseStock, decreaseStock } from '../controllers/inventoryController';

const router = Router();

// Inventory management routes
router.post('/:id/increase', increaseStock);
router.post('/:id/decrease', decreaseStock);

export default router;