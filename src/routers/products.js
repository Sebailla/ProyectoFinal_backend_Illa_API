import { Router } from 'express'
import { getProducts, getProductById, addProduct, deleteProduct, updateProduct } from '../controller/products.controller.js'
import { uploader } from '../config/multer.config.js'
import { admin, jwtValidity } from '../middleware/auth.js'
import { check } from "express-validator"
import { fieldValidate} from "../middleware/validate.middleware.js"
//import { codeExist } from '../helpers/DbValidation.js'
import { addLogger } from '../utils/logger.js'

const router = Router()

router.get('/', addLogger, getProducts)

router.get('/:pid', addLogger, getProductById)

router.post('/', [
    addLogger,
    jwtValidity,
    admin,
    uploader.single('file'), 
], addProduct)

router.put('/:pid', [
    addLogger,
    jwtValidity,
    admin,
    check('pid','No es un Id de producto válido').isMongoId(),
    fieldValidate,
    uploader.single('file')
], updateProduct)

router.delete('/:pid', [
    addLogger,
    jwtValidity,
    admin,
    check('pid','No es un Id de producto válido').isMongoId(),
    fieldValidate,
], deleteProduct)

export default router
