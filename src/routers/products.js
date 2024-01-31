import { Router } from 'express'
import { getProducts, getProductById, addProduct, deleteProduct, updateProduct } from '../controller/products.controller.js'
import { uploader } from '../config/multer.config.js'
import { jwtValidity } from '../middleware/auth.js'

const router = Router()


router.get('/', jwtValidity, getProducts)

router.get('/:pid', jwtValidity, getProductById)

router.post('/', [
    jwtValidity,
    uploader.single('file'), 
], addProduct)

router.put('/:pid', [
    jwtValidity,
    uploader.single('file')
], updateProduct)

router.delete('/:pid', jwtValidity, deleteProduct)



export default router
