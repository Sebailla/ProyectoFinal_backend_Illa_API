import jwt from 'jsonwebtoken'
import config from './config.js'
import { logger } from '../utils/logger.js'

export const generateToken = (user, timeExpire = '8h') => {
    try {
        const token =  jwt.sign(user, config.jwtSecretKey, {expiresIn: timeExpire})
        
        return token
    } catch (error) {
        logger.error(`Error al generar el Token de auth - ${new Date().toLocaleString()}`)
        throw error
    }
}