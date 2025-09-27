import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connect } from "./config/database"
import productRoutes from "./routes/productRoutes"
import inventoryRoutes from "./routes/inventoryRoutes"

dotenv.config();

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Database connection method
connect()

// API Routes
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/stocks', inventoryRoutes)

app.get('/api/v1/health', (req,res) => {
    res.status(200).json({message: "Inventory API is running !"})
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})