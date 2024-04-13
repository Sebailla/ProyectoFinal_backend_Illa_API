import CartsModel from './models/carts.model.js'

export const getCarts = async () => {
        return await CartsModel.find().populate('products').lean()
}

export const getCartById = async (cid) => {
        return await CartsModel.findById(cid).populate('products.id', ['title', 'price', 'stock', 'thumbnail']).lean()
}

export const addCart = async () => {
        return await CartsModel.create({})
}

export const addProductToCart = async (cid, pid) => {
        const result = await CartsModel.findById(cid)
        console.log(result)
        if (!result)
                return null

        const producyInCart = result.products.find(p => p.id.toString() === pid)
        if (producyInCart) {
                producyInCart.quantity++
        } else {
                result.products.push({ id: pid, quantity: 1 })
        }
        result.save()

        return await getCartById(cid)

}

export const updateProductInCart = async (cid, pid, quantity) => {

        const result = await CartsModel.findById(cid)
        console.log(result)
        if (!result)
                return null

        const producyInCart = result.products.find(p => p.id.toString() === pid)
        if (producyInCart) {
                producyInCart.quantity = quantity
        } 
        result.save()

        return await getCartById(cid)

        /* return await CartsModel.findOneAndUpdate(
                { _id: cid, 'products.id': pid },
                { $set: { 'products.$.quantity': quantity } },
                { new: true }
        ).populate('products.id', ['title', 'price', 'stock', 'thumbnail']) */
}

export const deleteProductInCart = async (cid, pid) => {
        return await CartsModel.findByIdAndUpdate(
                cid, 
                { $pull: { 'products': { id: pid } } }, 
                { new: true }
        ).populate('products.id', ['title', 'price', 'stock', 'thumbnail'])
}

export const deleteCart = async (cid) => {
        await CartsModel.findByIdAndDelete(cid)
}

export const deleteAllProductsInCart = async (cid) => {
        await CartsModel.findByIdAndUpdate(cid, { $set: { 'products': [] } }, { new: true })
}