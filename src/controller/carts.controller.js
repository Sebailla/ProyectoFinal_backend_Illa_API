import { request, response } from "express"

import { CartRepository, ProductRepository, TicketRepository, UserRepository } from "../repositories/index.repository.js"

import { v4 as uuidv4 } from 'uuid'
import cartsModel from "../dao/mongo/models/carts.model.js"

export const getCarts = async (req = request, res = response) => {
    try {
        const result = await CartRepository.getCarts()
        return res.json({ result })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const getCartById = async (req = request, res = response) => {
    /* try {
        const { cid } = req.params
        const result = await CartRepository.getCartById(cid)
        if (!result) {
            return res.status(404).json({ msg: `El pedido con ID: ${cid}, no existe` })
        } else {
            return res.json({ result })
        }
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    } */
    try {
        const { _id } = req
        const { cid } = req.params

        const user = await UserRepository.getUserById(_id)

        if (!user) {
            return res.status(400).json({ msn: 'User not found or unauthorized user' })
        }

        if (!(user.cart_id.toString() === cid)) {
            return res.status(400).json({ msn: 'Cart not found or unauthorized access ' })
        }

        const result = await CartRepository.getCartById(cid)

        return res.json({ result })

    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const addCart = async (req = request, res = response) => {
    try {
        const result = await CartRepository.addCart()
        return res.json({ msg: 'Pedido creado correctamente', result })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const addProductToCart = async (req = request, res = response) => {
    /* try {
        const { cid, pid } = req.params
        const result = await CartRepository.addProductToCart(cid, pid)
        if(!result){
            return res.status(400).json({ msg: `El pedido con ID: ${cid}, no existe`})
        }
        return res.json({ msg: `El pedido con ID: ${cid}, actualizado corectamente`, result })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    } */
    try {
        const { _id } = req
        const { cid, pid } = req.params
        const user = await UserRepository.getUserById(_id)
        const product = await ProductRepository.getProductById(pid)

        if (!user) {
            return res.status(400).json({ msn: 'User not found' })
        }

        if (!(user.cart_id.toString() === cid)) {
            return res.status(400).json({ msn: 'Cart not found' })
        }

        if (!product) {
            return res.status(400).json({ msn: 'Product not found' })
        }

        const result = await CartRepository.addProductToCart(cid, pid)

        if (!result) {
            return res.status(400).json({ msg: `El pedido con ID: ${cid}, no existe` })
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
        const { _id } = req
        const { cid, pid } = req.params
        const user = await UserRepository.getUserById(_id)
        const product = await ProductRepository.getProductById(pid)

        if (!user) {
            return res.status(400).json({ msn: 'User not found' })
        }

        if (!(user.cart_id.toString() === cid)) {
            return res.status(400).json({ msn: 'Cart not found' })
        }

        if (!product) {
            return res.status(400).json({ msn: 'Product not found' })
        }

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

//?  Ticket

export const purchase = async (req = request, res = response) => {
    try {
        const { _id } = req
        const { cid } = req.params

        const user = await UserRepository.getUserById(_id)

        if (!(user.cart_id.toString() === cid)) {
            return res.status(400).json({ msn: 'Cart not found' })
        }

        const cart = await CartRepository.getCartById(cid)

        //Validar stock del producto
        if (!(cart.products.length > 0)) {
            return res.status(400).json({ msn: 'Cart empty', cart })
        }
        const stock = cart.products.filter(p => p.id.stock >= p.quantity)

        //Atualizar stock
        const newStock = stock.map(p => ProductRepository.updateProduct(p.id._id, { stock: p.id.stock - p.quantity }))
        await Promise.all(newStock)

        //Crear Ticket (code, amount, purchaser)
        const items = stock.map(i => (
            {
                id: i.id._id,
                title: i.id.title,
                price: i.id.price,
                quantity: i.quantity,
                total: i.id.price * i.quantity
            }
        ))

        let amount = 0
        items.forEach(e => { amount += e.total })

        const code = uuidv4()  //Genero code autoincrementable

        const purchaser = user.email

        const purchase_datetime = new Date().toLocaleString()

        await TicketRepository.addTicket({ code, items, amount, purchaser, purchase_datetime })

        //Si no hay stock suficiente no se agrega el producto

        const cartId = user.cart_id
        for (let product of cart.products) {
            if (stock.some(s => s.id._id === product.id._id)) {
                await CartRepository.deleteProductInCart(cartId, product.id._id)
            }
        }

        return res.json({ msg: 'Compra finalzada corectamente', ticket: { code, items, amount, purchaser, purchase_datetime }})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Internal server error' })
    }
}