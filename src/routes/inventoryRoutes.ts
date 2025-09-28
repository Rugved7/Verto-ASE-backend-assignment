import { Router } from 'express';
import { increaseStock, decreaseStock } from '../controllers/inventoryControllers';

const router = Router();

// Inventory management routes
router.post('/:id/increase', increaseStock);
router.post('/:id/decrease', decreaseStock);

export default router;