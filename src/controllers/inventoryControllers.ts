import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { AuditLogService } from '../services/auditLogService';

// Increase stock quantity
export const increaseStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Amount must be a positive number' });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const oldStock = product.stock_quantity
    product.stock_quantity += amount;
    const updatedProduct = await product.save();

    // Audit Logs for Increasing stock 
    await AuditLogService.logAction(
      req.params.id,
      'STOCK_INCREASE',
      { stock_quantity: oldStock },
      { stock_quantity: updatedProduct.stock_quantity, amount_increased: amount }
    )

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to increase stock' });
  }
};

// Decrease stock quantity
export const decreaseStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Amount must be a positive number' });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (product.stock_quantity < amount) {
      res.status(400).json({
        error: 'Insufficient stock',
        currentStock: product.stock_quantity,
        requestedAmount: amount
      });
      return;
    }

    const oldStock = product.stock_quantity
    product.stock_quantity -= amount;
    const updatedProduct = await product.save();

    // Audit Log for decreasing stock
    await AuditLogService.logAction(
      req.params.id,
      'STOCK_DECREASE',
      { stock_quantity: oldStock },
      { stock_quantity: updatedProduct.stock_quantity, amount_decreased: amount }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to decrease stock' });
  }
};