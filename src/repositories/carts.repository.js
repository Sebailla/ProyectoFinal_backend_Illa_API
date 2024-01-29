import { CartDao } from "../dao/factory.js"

export const getCarts = async () => {
    return await CartDao.getCarts()
}

export const getCartById = async (cid) => {
    return await CartDao.getCartById(cid)
}

export const addCarts = async () => {
    return await CartDao.addCarts()
}

export const addProductToCart = async (cid, pid) => {
    return await CartDao.addProductToCart(cid, pid)
}

export const updateProductInCart = async (cid, pid, quantity) => {
    return await CartDao.updateProductInCart(cid, pid, quantity)
}

export const deleteProductInCart = async (cid, pid) => {
    return await CartDao.deleteProductInCart(cid, pid)
}

export const deleteCart = async (cid) => {
    return await CartDao.deleteCart(cid)
}