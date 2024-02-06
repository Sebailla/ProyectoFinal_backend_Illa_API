import { Router } from 'express'
import { getCarts, getCartById, addCart, addProductToCart, deleteCart, deleteProductInCart, updateProductInCart, purchase } from '../controller/carts.controller.js'
import { admin, jwtValidity } from '../middleware/auth.js'
import { check } from 'express-validator'
import { cartExist } from '../helpers/DbValidation.js'
import { fieldValidate } from '../middleware/validate.middleware.js'
import { addLogger } from '../utils/logger.js'

const router = Router()

// get All Cart
router.get('/', [jwtValidity, admin, addLogger], getCarts)
// Cart por Id
router.get('/:cid', [jwtValidity, addLogger], getCartById)
// Add Cart
router.post('/', [jwtValidity, addLogger], addCart)
//Add products to Cart
router.post('/:cid/products/:pid', [jwtValidity, addLogger], addProductToCart)

//router.put('/:cid', )
//Actualiza el quantity
router.put('/:cid/products/:pid', [jwtValidity, addLogger], updateProductInCart)

// Eliminamos todos los productos del Cart
router.delete('/:cid', [jwtValidity, addLogger], deleteCart)

router.delete('/:cid/products/:pid', [jwtValidity, addLogger], deleteProductInCart)

//?   Ticket

router.post('/:cid/purchase', [
    addLogger,
    jwtValidity,
    check('cid', 'Id de Cart no es válido').isMongoId(),
    check('cid').custom(cartExist),
    fieldValidate,
], purchase)

export default router