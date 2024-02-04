import CartsModel from './models/carts.model.js'

export const getCarts = async () => {
        return await CartsModel.find().populate('products').lean()
}

export const getCartById = async (cid) => {
        return await CartsModel.findById(cid).populate('products.id', ['title', 'price', 'stock']).lean()
}

export const addCart = async () => {
        return await CartsModel.create({})
}

export const addProductToCart = async (cid, pid) => {
        const result = await CartsModel.findById(cid)
        if (!result) {
                return null
        } else {
                const producyInCart = result.products.find(p => p.id.toString() === pid)
                if (producyInCart) {
                        producyInCart.quantity++
                } else {
                        result.products.push({ id: pid, quantity: 1 })
                }
                result.save()

                return result
        }
}

export const updateProductInCart = async (cid, pid, quantity) => {
        return await CartsModel.findOneAndUpdate(
                { _id: cid, 'products.id': pid },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
        )
}

export const deleteProductInCart = async (cid, pid) => {
        return await CartsModel.findByIdAndUpdate(cid, { $pull: { 'products': { id: pid } } }, { new: true })
}

export const deleteCart = async (cid) => {
        return await CartsModel.findByIdAndDelete(cid)
}

export const deleteAllProductsInCart = async (cid) => {
        return await CartsModel.findByIdAndUpdate(cid, { $set: { 'products': [] } }, { new: true })
}