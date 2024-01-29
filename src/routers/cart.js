import {Router} from 'express'
import { getCarts, getCartById, addCart, addProductToCart, deleteCart, deleteProductInCart, updateProductInCart } from '../controller/carts.controller.js'

const router = Router()

// All Cart
router.get('/', getCarts)
// Cart por Id
router.get('/:cid', getCartById)
// Add Cart
router.post('/', addCart)
//Add products to Cart
router.post('/:cid/products/:pid', addProductToCart)

//router.put('/:cid', )
//Actualiza el quantity
router.put('/:cid/products/:pid', updateProductInCart)

// Eliminamos todos los productos del Cart
router.delete('/:cid', deleteCart)

router.delete('/:cid/products/:pid', deleteProductInCart)


export default router