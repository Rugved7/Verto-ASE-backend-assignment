import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const connect = async(): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        console.log("Database connected");
    } catch (error) {
        console.log("MongoDB connection Error");
        process.exit(1)
    }
}