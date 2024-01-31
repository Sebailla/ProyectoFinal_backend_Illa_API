import { Router } from 'express'
import { getCarts, getCartById, addCart, addProductToCart, deleteCart, deleteProductInCart, updateProductInCart } from '../controller/carts.controller.js'
import { jwtValidity } from '../middleware/auth.js'

const router = Router()

// All Cart
router.get('/', jwtValidity, getCarts)
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


export default router