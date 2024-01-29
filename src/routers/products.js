import { Router } from 'express'
import { getProducts, getProductById, addProduct, deleteProduct, updateProduct } from '../controller/products.controller.js'
import { uploader } from '../config/multer.config.js'

const router = Router()


router.get('/', getProducts)
router.get('/:pid', getProductById)


router.post('/', uploader.single('file'),  addProduct)
router.put('/:pid', uploader.single('file'), updateProduct)
router.delete('/:pid', deleteProduct)



export default router
