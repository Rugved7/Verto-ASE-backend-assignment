import {Schema, model, Document} from "mongoose"

export interface IProduct extends Document {
    name: string, 
    description: string, 
    stock_quantity: number,
    low_stock_threshold: number 
}

const productSchema = new Schema<IProduct>({
    name: {type : String, required:true},
    description: {type: String, required:true}, 
    stock_quantity: {type: Number, required: true, min:0, default: 0}, 
    low_stock_threshold: {type:Number, required: true, default: 10}
}, {
    timestamps: true
})

export const Product = model<IProduct>('product', productSchema)