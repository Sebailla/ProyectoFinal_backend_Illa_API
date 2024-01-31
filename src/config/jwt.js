import jwt from 'jsonwebtoken'
import config from './config.js'

export const generateToken = (user) => {
    try {
        const token =  jwt.sign({user}, config.jwtSecretKey, {expiresIn: '8h'})
        return token
    } catch (error) {
        console.log(error)
        throw error
    }
}