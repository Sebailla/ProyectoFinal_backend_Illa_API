import { request, response } from "express"

import { cloudinary } from "../config/cloudinary.config.js"
import { validFileExtension } from "../utils.js"

import { ProductRepository } from "../repositories/index.repository.js"
import { logger } from "../utils/logger.js"

export const getProducts = async (req = request, res = response) => {
    try {
        const result = await ProductRepository.getProducts({ ...req.query })
        return res.json({ result })
    } catch (error) {
        logger.error(`Error en getProducts-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ status: 'Error en servidor' })
    }
}

export const getProductById = async (req = request, res = response) => {
    try {
        const { pid } = req.params
        const result = await ProductRepository.getProductById(pid)
        if (result) {
            return res.json({ result })
        } else {
            logger.info(`El producto con ID: ${pid}, no está en existencia - ${new Date().toLocaleString()}`)
            return res.status(404).json({ msg: `El producto con ID: ${pid}, no está en existencia` })
        }
    } catch (error) {
        logger.error(`Error en getProductById-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const addProduct = async (req = request, res = response) => {
    try {
        const { title, description, price, code, stock, category } = req.body

        if(!title || !description || !price || !code || !stock || !category){
            logger.info(`Incompletes Dates in addProduct - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msg: 'Incompletes Dates' })
        }

        if (req.file) {
            const isValidExtension = validFileExtension(req.file.originalname)
            if (!isValidExtension) {
                logger.info(`Formato no corresponde a imagen, solo se permiten los siguientes formatos: .png, .jpg y . jpeg - ${new Date().toLocaleString()}`)
                return res.status(400).json({ msg: 'Formato no corresponde a imagen, solo se permiten los siguientes formatos: .png, .jpg y . jpeg' })
            }
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            req.body.thumbnail = secure_url
        }

        const result = await ProductRepository.addProduct({ ...req.body })

        logger.info(`Producto agregado corectamente - ${new Date().toLocaleString()}`)
        return res.json({ msg: 'Producto agregado corectamente', result })

    } catch (error) {
        logger.error(`Error en addProduct-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const updateProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params
        const { _id, ...rest } = req.body
        const product = await ProductRepository.getProductById(pid)

        if (!product) {
            logger.info(`El Producto con Id: ${pid}, no se encuentra en existencia - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msg: `El Producto con Id: ${pid}, no se encuentra en existencia` })
        }

        if (req.file) {
            const isValidExtension = validFileExtension(req.file.originalname)
            if (!isValidExtension) {
                logger.info(`Formato no corresponde a imagen, solo se permiten los siguientes formatos: .png, .jpg y . jpeg' - ${new Date().toLocaleString()}`)
                return res.status(400).json({ msg: 'Formato no corresponde a imagen, solo se permiten los siguientes formatos: .png, .jpg y . jpeg' })
            }
            if (product.thumbnail) {
                //elimina imagen y reemplaza por una nueva
                const imgUrl = product.thumbnail.split('/')
                const img = imgUrl[imgUrl.length - 1]
                const [imgId] = img.split('.')
                cloudinary.uploader.destroy(imgId)
            }
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            rest.thumbnail = secure_url
        }

        const result = await ProductRepository.updateProduct(pid, rest)
        if (result) {
            logger.info(`Producto actualizado correctamente - ${new Date().toLocaleString()}`)
            return res.json({ msg: 'Producto actualizado correctamente', result })
        } else {
            logger.info(`El producto con Id: ${pid}, no se pudo actualizar - ${new Date().toLocaleString()}`)
            return res.status(404).json({ msg: `El producto con Id: ${pid}, no se pudo actualizar` })
        }
    } catch (error) {
        logger.error(`Error en updateProduct-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const deleteProduct = async (req = request, res = response) => {
    try {
        const { pid } = req.params
        const result = await ProductRepository.deleteProduct(pid)
        if (result) {
            logger.info(`Producto eliminado correctamente - ${new Date().toLocaleString()}`)
            return res.json({ msg: 'Producto eliminado correctamente', result })
        } else {
            logger.info(`El producto con Id: ${pid}, no se pudo eliminar - ${new Date().toLocaleString()}`)
            return res.status(404).json({ msg: `El producto con Id: ${pid}, no se pudo eliminar` })
        }
    } catch (error) {
        logger.error(`Error en deleteProduct-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

