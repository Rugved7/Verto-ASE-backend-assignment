import { Router } from 'express';
import { increaseStock, decreaseStock } from '../controllers/inventoryController';

const router = Router();

// Inventory management routes
router.post('/:id/stock/increase', increaseStock);
router.post('/:id/stock/decrease', decreaseStock);

export default router;