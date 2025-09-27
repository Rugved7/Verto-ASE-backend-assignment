import { Pool } from "pg";
import dotenv from "dotenv"

dotenv.config()

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: true
})


export const connect = async () => {
    try {
        const client = await pool.connect()
        console.log("Database connected");
        client.release()
    } catch (error) {
        console.log("Error conneccting database");
    }
}