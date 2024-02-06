import jwt from 'jsonwebtoken'
import config from './config.js'
import { logger } from '../utils/logger.js'

export const generateToken = (user) => {
    try {
        const token =  jwt.sign(user, config.jwtSecretKey, {expiresIn: '8h'})
        return token
    } catch (error) {
        logger.error(`Error al generar el Token de auth - ${new Date().toLocaleString()}`)
        throw error
    }
}