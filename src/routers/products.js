import { Router } from 'express'
import { getProducts, getProductById, addProduct, deleteProduct, updateProduct } from '../controller/products.controller.js'
import { uploader } from '../config/multer.config.js'
import { admin, jwtValidity } from '../middleware/auth.js'
import { check } from "express-validator"
import { fieldValidate} from "../middleware/validate.middleware.js"
import { codeExist } from '../helpers/DbValidation.js'
import { addLogger } from '../utils/logger.js'


const router = Router()

router.get('/', [jwtValidity, addLogger], getProducts)

router.get('/:pid', [jwtValidity, addLogger], getProductById)

router.post('/', [
    addLogger,
    jwtValidity,
    admin,
    check('title', 'El campo "Título" es obligatorio').not().isEmpty(),
    check('description', 'El campo "Descripción" es obligatorio').not().isEmpty(),
    check('code', 'El campo "Código" es obligatorio').not().isEmpty(),
    check('code').custom(codeExist),
    check('price', 'El campo "Precio" es obligatorio').not().isEmpty(),
    check('price', 'El campo "Precio" debe ser un número').isNumeric(),
    check('stock', 'El campo "Stock" es obligatorio').not().isEmpty(),
    check('stock', 'El campo "Stock" debe ser un número').isNumeric(),
    check('category', 'El campo "Categoría" es obligatorio').not().isEmpty(),
    fieldValidate,
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
