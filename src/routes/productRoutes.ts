import {Router} from "express"
import {getAllProducts, getProductById, createProduct} from "../controllers/productControllers"

const router = Router()

// Product CRUD Routes
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', createProduct)

export default router