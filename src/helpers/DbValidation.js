import { CartRepository, ProductRepository, UserRepository } from "../repositories/index.repository.js"

export const emailExist = async (email) => {
    const result = await UserRepository.getUserByEmail(email)
    if (result) {
        logger.error(`El email: ${email}, ya se encuentra registrado - ${new Date().toLocaleString()}`)
        throw new Error(`El email: ${email}, ya se encuentra registrado`)
    }

}

export const codeExist = async (code) => {
    const result = await ProductRepository.getProductByCode(code)
    if (result) {
        logger.error(`El codigo: ${code}, ya se encuentra asignado a un producto - ${new Date().toLocaleString()}`)
        throw new Error(`El codigo: ${code}, ya se encuentra asignado a un producto`)
    }

}

export const cartExist = async (idCart) => {
    const result = await CartRepository.getCartById(idCart)
    if (!result) {
        logger.error(`Cart con Id: ${idCart}, no existe - ${new Date().toLocaleString()}`)
        throw new Error(`Cart con Id: ${idCart}, no existe`)
    }

}
