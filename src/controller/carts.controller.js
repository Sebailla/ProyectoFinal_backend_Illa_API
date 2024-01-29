import { request, response } from "express"

import { CartRepository } from "../repositories/index.repository.js"

export const getCarts = async (req = request, res = response) => {
    try {
        const result = await CartRepository.getCarts()
        return res.json({ result })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const getCartById = async (req = request, res = response) => {
    try {
        const { cid } = req.params
        const result = await CartRepository.getCartById(cid)
        if (!result) {
            return res.status(404).json({ msg: `El pedido con ID: ${cid}, no existe` })
        } else {
            return res.json({ result })
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const addCart = async (req = request, res = response) => {
    try {
        const result = await CartRepository.addCarts()
        return res.json({ msg: 'Pedido creado correctamente', result })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const addProductToCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params
        const result = await CartRepository.addProductToCart(cid, pid)
        if(!result){
            return res.status(400).json({ msg: `El pedido con ID: ${cid}, no existe`})
        }
        return res.json({ msg: `El pedido con ID: ${cid}, actualizado corectamente`, result })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const updateProductInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        if (!quantity || !Number.isInteger(quantity))
            return res.status(404).json({ msg: 'La cantidad debe ser un número' })
        const cart = await CartRepository.updateProductInCart(cid, pid, quantity)
        if (!cart) {
            return res.status(404).json({ msg: `El pedido con Id: ${cid}, no se pudo actualizar` })
        } else {
            return res.json({ msg: 'Pedido Actializado correctamente', cart })
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const deleteProductInCart = async (req = request, res = response) => {
    try {
        const { cid, pid } = req.params
        const result = await CartRepository.deleteProductInCart(cid, pid)
        if (!result) {
            return res.status(400).json({ msg: 'Error al eliminar producto del pedido' })
        } else {
            return res.json({ msg: 'Producto eliminado', result })
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const deleteCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params
        const result = await CartRepository.deleteCart(cid)
        if (result) {
            return res.json({ msg: 'Pedido eliminado correctamente', result })
        } else {
            return res.status(404).json({ msg: `El pedido con Id: ${pid}, no se pudo eliminar` })
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}