import { request, response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'


export const auth = (req = request, res = response, next) => {
    if (req.session?.user) {
        return next()
    }
    return res.redirect('/login')
}

export const admin = (req = request, res = response, next) => {
    if (req.session?.role === 'admin') {
        return next()
    }
    return res.redirect('/')
}

export const jwtValidity = (req = request, res = response, next) => {
    //const token = req.header('Authorization')?.replace('Bearer ', '')
    const token = req.header('token')
    if(!token){
        return res.status(401).json('User no authenticated')
    }else{
        try {
            const{_id, email}= jwt.verify(token, config.jwtSecretKey)
            req._id = _id
            req.email = email
        } catch (error) {
            console.log(error)
            return res.status(401).json('Invalid Token')
        }
    }
    next()
}

