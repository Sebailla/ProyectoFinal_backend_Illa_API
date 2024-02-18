import { request, response } from 'express'
import { CartRepository, UserRepository } from '../repositories/index.repository.js'
import { createHash, isValidPassword } from '../utils.js'
import { generateToken } from '../config/jwt.js'
import { logger } from '../utils/logger.js'
import config from '../config/config.js'
import { sendEmail } from '../utils/sendEmail.js'
import jwt from 'jsonwebtoken'

export const addUser = async (req = request, res = response) => {
    try {
        //Hash de password
        req.body.password = createHash(req.body.password)

        // Creamos Cart asociado a User
        const cart = await CartRepository.addCart()

        if (!cart) {
            logger.warning(`Cart not found - ${new Date().toLocaleString()}`)
            return res.status(500).json({ msg: 'Cart not found' })
        } else {
            req.body.cart_id = cart
        }
        //Creamos User
        const result = await UserRepository.registerUser(req.body)

        //Generamos Token
        const { _id, firstName, lastName, age, email, role, cart_id } = result

        const token = generateToken({ _id, firstName, lastName, age, email, role, cart_id })

        logger.info(`New User: ${firstName} ${lastName}, added success - ${new Date().toLocaleString()}`)
        return res.json({ msg: `New User: ${firstName} ${lastName}, added success`, token })
    } catch (error) {
        logger.error(`Error en addUser-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const loginUser = async (req = request, res = response) => {
    try {
        const { email, password } = req.body

        const user = await UserRepository.getUserByEmail(email)

        if (!user) {
            logger.warning(`Incorrect User or password - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msg: 'Incorrect User or password' })
        }

        const validPassword = isValidPassword(password, user.password)

        if (!validPassword) {
            logger.warning(`Incorrect User or password - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msg: 'Incorrect User or password' })
        }

        const { _id, firstName, lastName, age, role, cart_id } = user

        const token = generateToken({ _id, firstName, lastName, age, email, role, cart_id })

        logger.info(`IUser: ${user.firstName} ${user.lastName}, has been login success - ${new Date().toLocaleString()}`)

        return res.json({ msg: 'Login is OK', User: `${user.firstName} ${user.lastName}, has been login success`, token, user })
    } catch (error) {
        logger.error(`Error en loginUser-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const revalidToken = async (req = request, res = response) => {
    try {
        const { _id, firstName, lastName, age, email, role, cart_id } = req

        const user = await UserRepository.getUserByEmail(email)

        const token = generateToken({ _id, firstName, lastName, age, email, role, cart_id })

        logger.info(`Revalidate Token OK - User: ${firstName} ${lastName} - ${new Date().toLocaleString()}`)

        return res.json({ msg: 'revalidate token OK', user, Token: token })


    } catch (error) {
        logger.error(`Error en revalidToken-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const passwordRecovery = async (req = request, res = response) => {
    try {
        const { email } = req.body

        const user = await UserRepository.getUserByEmail(email)

        if (!user) {
            logger.info(`Invalid User: ${email} - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msg: 'Invalid User' })
        }
        const token = generateToken({ email }, '1h')

        const resetUrl = `${config.urlPasswordReset}?token=${token}`

        sendEmail(email, resetUrl)

        logger.info(`Send email to: ${email} - Password Recovery - ${new Date().toLocaleString()}`)

        return res.json({ msg: 'Sending email OK', token})


    } catch (error) {
        logger.error(`Error en passwordRecovery-controller - ${new Date().toLocaleString()}`)

        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const passwordRecoveryTokenValidation = async (req = request, res = response) => {
    try {
        const { token } = req.query

        const { email } = jwt.verify(token, config.jwtSecretKey)


        logger.info(`Token validation OK - ${token} - ${new Date().toLocaleString()}`)

        return res.json({ msg: 'Token Validation OK', email })


    } catch (error) {
        logger.error(`Error en passwordRecoveryTokenValidation-controller - ${new Date().toLocaleString()}`)

        return res.status(400).json({ msg: 'Invalid Token' })
    }
}

export const passwordReset = async (req = request, res = response) => {
    try {
        const {token, password} = req.body
        const {email} = jwt.verify(token, config.jwtSecretKey)
        const user = await UserRepository.getUserByEmail(email)

        
        if(!user) {
            logger.warning(`User: ${email} - User not found - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msg: 'User not found' })
        }

        const validPassword = isValidPassword(password, user.password)

        
        if(validPassword) {
            logger.warning(`User: ${email} - you must use a different password than the previous ones - ${new Date().toLocaleString()}`)
            return res.status(400).json({ msg: 'you must use a different password than the previous ones'})
        }

        user.password = createHash(password)
        user.save()

        logger.info(`User: ${email} - Password Successfully Reset - ${new Date().toLocaleString()}`)
        return res.json({ msg: 'Password Successfully Reset'})

    } catch (error) {
        logger.error(`Error en passwordReset-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Server error' })
    }
}