import { request, response } from "express"
import { CartRepository, ProductRepository, TicketRepository, UserRepository } from "../repositories/index.repository.js"
import { sendEmailTicket } from '../helpers/sendEmail.js'
import { v4 as uuidv4 } from 'uuid'
import { logger } from "../utils/logger.js"
import { MercadoPagoConfig, Preference } from 'mercadopago'
import config from '../config/config.js'

export const getCarts = async (req = request, res = response) => {
    try {
        const result = await CartRepository.getCarts()
        return res.json({ result })
    } catch (error) {
        logger.error(`Error en getCarts-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const getCartById = async (req = request, res = response) => {
    try {
        const { _id } = req
        const { cid } = req.params

        const user = await UserRepository.getUserById(_id)

        if (!user) {
            logger.warning(`User not found or unauthorized user - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msn: 'User not found or unauthorized user' })
        }

        if (!(user.cart_id.toString() === cid)) {
            logger.warning(`Cart not found or unauthorized access - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msn: 'Cart not found or unauthorized access ' })
        }

        const result = await CartRepository.getCartById(cid)

        return res.json({ ok: true, result })

    } catch (error) {
        logger.error(`Error en getCartById-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const addProductToCart = async (req = request, res = response) => {
    try {
        const { _id } = req
        const { cid, pid } = req.params
        const user = await UserRepository.getUserById(_id)
        const product = await ProductRepository.getProductById(pid)

        if (!user) {
            logger.warning(`User not found - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msn: 'User not found' })
        }

        if (!(user.cart_id.toString() === cid)) {
            logger.warning(`Cart not found - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msn: 'Cart not found' })
        }

        if (!product) {
            logger.warning(`Product not found - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msn: 'Product not found' })
        }

        const result = await CartRepository.addProductToCart(cid, pid)

        if (!result) {
            logger.warning(`El pedido con ID: ${cid}, no existe - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msg: `El pedido con ID: ${cid}, no existe` })
        }

        logger.info(`El pedido con ID: ${cid}, actualizado corectamente - ${new Date().toLocaleString()}`)

        return res.json({ msg: `El pedido con ID: ${cid}, actualizado corectamente`, result })

    } catch (error) {
        logger.error(`Error en addProductToCart-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const updateProductInCart = async (req = request, res = response) => {

    try {
        const { _id } = req
        const { cid, pid } = req.params
        const { quantity } = req.body
        console.log({ _id, cid, pid, quantity })

        const user = await UserRepository.getUserById(_id)
        console.log({ user })

        if (!user) {
            logger.warning(`User not found - ${new Date().toLocaleString()}`)
            return res.status(400).json({ ok: false, msn: 'User not found' })
        }

        if (!(user.cart_id.toString() === cid)) {
            logger.warning(`El pedido con ID: ${cid}, no existe - ${new Date().toLocaleString()}`)
            return res.status(400).json({ ok: false, msg: `El pedido con ID: ${cid}, no existe` })
        }

        const product = await ProductRepository.getProductById(pid)
        console.log({ product })

        if (!product) {
            logger.warning(`El producto con ID: ${pid}, no existe - ${new Date().toLocaleString()}`)
            return res.status(400).json({ ok: false, msg: `El producto con ID: ${pid}, no existe` })
        }

        /* if (!quantity || !Number.isInteger(quantity)) {
            logger.warning(`La cantidad debe ser un número - ${new Date().toLocaleString()}`)
            return res.status(404).json({ msg: 'La cantidad debe ser un número' })
        } */
        console.log({ quantity })

        const cart = await CartRepository.updateProductInCart(cid, pid, quantity)

        logger.info(`Pedido Actializado correctamente - ${new Date().toLocaleString()}`)
        return res.json({ msg: 'Pedido Actializado correctamente', cart })

    } catch (error) {
        logger.error(`Error en updateProductInCart-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const deleteProductInCart = async (req = request, res = response) => {
    try {
        const { _id } = req
        const { cid, pid } = req.params
        const user = await UserRepository.getUserById(_id)
        const product = await ProductRepository.getProductById(pid)
        console.log({ _id, cid, pid, user, product })
        if (!user) {
            logger.warning(`User not found - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msn: 'User not found' })
        }

        if (!(user.cart_id.toString() === cid)) {
            logger.warning(`Cart not found - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msn: 'Cart not found' })
        }

        if (!product) {
            logger.warning(`Product not found - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msn: 'Product not found' })
        }

        const result = await CartRepository.deleteProductInCart(cid, pid)
        console.log(result)
        
        logger.info(`Producto eliminado - ${new Date().toLocaleString()}`)
        return res.json({ msg: 'Producto eliminado', result })

    } catch (error) {
        logger.error(`Error en deleteProductInCart-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const deleteCart = async (req = request, res = response) => {
    try {
        const { cid } = req.params
        const result = await CartRepository.deleteCart(cid)
        if (result) {
            logger.info(`Pedido eliminado correctamente - ${new Date().toLocaleString()}`)
            return res.json({ msg: 'Pedido eliminado correctamente', result })
        } else {
            logger.warning(`El pedido con Id: ${pid}, no se pudo eliminar - ${new Date().toLocaleString()}`)
            return res.status(404).json({ msg: `El pedido con Id: ${pid}, no se pudo eliminar` })
        }
    } catch (error) {
        logger.error(`Error en deleteCart-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

//?  Ticket

export const purchase = async (req = request, res = response) => {
    try {
        const { _id } = req
        const { cid } = req.params

        const user = await UserRepository.getUserById(_id)
        console.log({ user })

        if (!(user.cart_id.toString() === cid)) return res.status(400).json({ ok: false, msg: 'Carrito no es valido!' })

        const cart = await CartRepository.getCartById(cid)
        console.log({ cart })

        if (!(cart.products.length > 0)) return res.status(400).json({ ok: false, msg: 'No se puede finalizar la compra, carrito vacio!', cart })

        const productosStockValid = cart.products.filter(p => p.id.stock >= p.quantity)

        const actualizacionesQuantity = productosStockValid.map(p =>
            ProductRepository.updateProduct(p.id._id, { stock: p.id.stock - p.quantity }))

        await Promise.all(actualizacionesQuantity)


        const items = productosStockValid.map(i => ({
            title: i.id.title,
            price: i.id.price,
            quantity: i.quantity,
            total: i.id.price * i.quantity
        }))

        let amount = 0;
        items.forEach(element => { amount = amount + element.total })
        const purchaser = user.email
        const code = uuidv4()
        const purchaseDate = new Date().toLocaleString()
        const ticketCompra = await TicketRepository.addTicket({ items, amount, purchaser, code, purchaseDate })

        let userName = `${user.lastName}, ${user.firstName}`

        // enviar email del recibo de la compra
        sendEmailTicket(purchaser, code, userName, items, amount, purchaseDate)
        logger.info(`Email enviado corectamente a: ${purchaser} - ${new Date().toLocaleString()}`)

        await CartRepository.deleteAllProductsInCart(user.cart_id)

        logger.info(`Compra finalzada corectamente - Ticket: ${code} - ${new Date().toLocaleString()}`)

        return res.json({ ok: true, msg: 'Compra generada', ticket: { purchaseDate, code, Cliente:purchaser, items, amount } })

    } catch (error) {
        logger.error(`Error en purchase-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Internal server error' })
    }
}

export const createIdPreference = async (req = request, res = response) => {
    try {
        const { _id } = req
        const { cid } = req.params
        const client = new MercadoPagoConfig({ accessToken: config.mpAccessToken })

        const cart = await CartRepository.getCartById(cid)
        console.log(cart.products)

        const items = cart.products.map(item => {
            return {
                title: item.id.title,
                unit_price: Number(item.id.price),
                quantity: Number(item.quantity),
                currency_id: 'ARS'
            }
        })

        const back_urls = {
            success: config.mpBackUrlsSeccess,
            failure: config.mpBackUrlsFailure,
            pending: config.mpBackUrlsPending,
        }

        const body = {
            items: items,
            back_urls: back_urls,
            auto_return: 'approved',
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        logger.info(`Pago Realizado en Mercado Pago - ${new Date().toLocaleString()}`)
        return res.json({ ok: true, idPreference: result.id })


    } catch (error) {
        logger.error(`Error en createIdPreference-Mercado Pago - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Internal server error' })
    }
}

