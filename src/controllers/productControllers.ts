import { Request, Response } from "express";
import { Product, IProduct } from "../models/Product";
import { error } from "console";

// Get All Products 
export const getAllProducts = async (req: Request, res:Response) : Promise<void> => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({error: "Failed to fetch products"})
    }
}

// Get a product by its id
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

// Create a Product 
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

// Update product
export const updateProduct = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {name, description, stock_quantity, low_stock_threshold} = req.body

        if(stock_quantity !== undefined && stock_quantity < 0){
            res.status(400).json({error: "stock quantity can't be negative"})
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, {
                name, 
                description, 
                stock_quantity, 
                low_stock_threshold, 
                updatedAt: new Date()
            }, {new:true, runValidators: true})

            if(!updatedProduct){
                res.status(404).json({error: "Product not found"})
                return 
            }

            res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({error: "Failed to update Product"})
    }
} 

// Delete Product 
export const deleteProduct = async (req: Request, res: Response) : Promise<void> => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)

        if(!deletedProduct){
            res.status(404).json({error: "Product not found"})
            return
        }

        res.status(200).json({message: "Product deleted successfully"})
    } catch (error) {
        res.status(500).json({error: "Failed to delete product"})
    }
}