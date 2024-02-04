import { CartRepository, ProductRepository, UserRepository } from "../repositories/index.repository.js"

export const emailExist = async (email) => {
    const result = await UserRepository.getUserByEmail(email)
    if (result) {
        throw new Error(`El email: ${email}, ya se encuentra registrado`)
    }

}

export const codeExist = async (code) => {
    const result = await ProductRepository.getProductByCode(code)
    if (result) {
        throw new Error(`El codigo: ${code}, ya se encuentra asignado a un producto`)
    }

}

export const cartExist = async (idCart) => {
    const result = await CartRepository.getCartById(idCart)
    if (!result) {
        throw new Error(`Cart con Id: ${idCart}, no existe`)
    }

}
