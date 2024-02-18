import { validationResult } from 'express-validator'
import { logger } from '../utils/logger.js'


export const fieldValidate = (req = request, res = response, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        logger.error(`Validation error - ${new Date().toLocaleString()} - `, error )
        return res.status(400).json(error)
    }
    next()
}