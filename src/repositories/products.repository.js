import { ProductDao } from "../dao/factory.js";

export const getProducts = async ( {limit, page, query, sort, category, status }) => {
    return await ProductDao.getProducts(limit, page, query, sort, category, status)
}

export const getProductById = async (pid) => {
    return await ProductDao.getProductById(pid)
}

export const getProductByCode = async (code) => {
    return await ProductDao.getProductByCode(code)
}

export const addProduct = async (body) => {
    return await ProductDao.addProduct(body)
}

export const updateProduct = async (pid, rest) => {
    return await ProductDao.updateProduct(pid, rest)
}

export const deleteProduct = async (pid) => {
    return await ProductDao.deleteProduct(pid)
}
