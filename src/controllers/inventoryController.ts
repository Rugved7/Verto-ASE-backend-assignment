import { Request, Response } from 'express';
import { Product } from '../models/Product';

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

    product.stock_quantity += amount;
    const updatedProduct = await product.save();

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

    product.stock_quantity -= amount;
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to decrease stock' });
  }
};