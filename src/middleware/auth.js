import { request, response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { logger } from '../utils/logger.js'


export const admin = (req = request, res = response, next) => {
    if (!(req.role === 'admin')) {
        logger.warning(`Unauthorized User - ${new Date().toLocaleString()}`)
        return res.status(403).json({msg: 'Unauthorized User'})
    }
    next()
    
}

export const jwtValidity = (req = request, res = response, next) => {
    //const token = req.header('Authorization')?.replace('Bearer ', '')
    const token = req.header('token')
    if(!token){
        logger.warning(`Unauthorized User - ${new Date().toLocaleString()}`)
        return res.status(401).json({msg: 'Unauthorized User'})
    }else{
        try {
            const{_id, email, role}= jwt.verify(token, config.jwtSecretKey)
            req._id = _id
            req.email = email
            req.role = role
        } catch (error) {
            console.log(error)
            logger.warning(`Invalid Token - ${new Date().toLocaleString()}`)
            return res.status(403).json({msg: 'Invalid Token'})
        }
    }
    next()
}

