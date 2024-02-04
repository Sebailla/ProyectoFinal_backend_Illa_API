import { Router } from 'express'
import { getCarts, getCartById, addCart, addProductToCart, deleteCart, deleteProductInCart, updateProductInCart, purchase } from '../controller/carts.controller.js'
import { admin, jwtValidity } from '../middleware/auth.js'
import { check } from 'express-validator'
import { cartExist } from '../helpers/DbValidation.js'
import { fieldValidate } from '../middleware/validate.middleware.js'

const router = Router()

// get All Cart
router.get('/', [jwtValidity, admin], getCarts)
// Cart por Id
router.get('/:cid', jwtValidity, getCartById)
// Add Cart
router.post('/', jwtValidity, addCart)
//Add products to Cart
router.post('/:cid/products/:pid', jwtValidity, addProductToCart)

//router.put('/:cid', )
//Actualiza el quantity
router.put('/:cid/products/:pid', jwtValidity, updateProductInCart)

// Eliminamos todos los productos del Cart
router.delete('/:cid', jwtValidity, deleteCart)

router.delete('/:cid/products/:pid', jwtValidity, deleteProductInCart)

//?   Ticket

router.post('/:cid/purchase', [
    jwtValidity,
    check('cid', 'Id de Cart no es válido').isMongoId(),
    check('cid').custom(cartExist),
    fieldValidate,
], purchase)

export default router