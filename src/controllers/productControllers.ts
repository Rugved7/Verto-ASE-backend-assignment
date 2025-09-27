import { Request, Response } from "express";
import { Product, IProduct } from "../models/Product";

export const getAllProducts = async (req: Request, res:Response) : Promise<void> => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({error: "Failed to fetch products"})
    }
}


export const getProductById = async (req: Request, res: Response) : Promise<void> => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            res.status(404).json({error: 'Product not found'})
            return 
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({error: "Failed to fetch products"})
    }
}

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const {name, description, stock_quantity, low_stock_threshold } = req.body
        if(!name || !description || stock_quantity == undefined){
            res.status(400).json({error: "Name, description, and stock quantity are required"})
            return
        }
        
        if(stock_quantity < 0){
            res.status(400).json({error: "Stock quantity cannot be negative "})
            return
        }

        const product = new Product({
            name, 
            description, 
            stock_quantity, 
            low_stock_threshold : low_stock_threshold || 10
        })

        const savedProduct = await product.save()
        res.status(201).json(savedProduct)
    } catch (error) {
        res.status(500).json({error: 'Failed to create product'})
    }
}