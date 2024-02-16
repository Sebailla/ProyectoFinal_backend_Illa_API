import { request, response } from 'express'
import { CartRepository, UserRepository } from '../repositories/index.repository.js'
import { createHash, isValidPassword } from '../utils.js'
import { generateToken } from '../config/jwt.js'
import { logger } from '../utils/logger.js'

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
        const {_id, firstName, lastName, age, email, role, cart_id} = req

        const user = await UserRepository.getUserByEmail(email)

        const token = generateToken({ _id, firstName, lastName, age, email, role, cart_id })

        logger.info(`Revalidate Token OK - User: ${firstName} ${lastName} - ${new Date().toLocaleString()}`)

        return res.json({ msg: 'revalidate token OK', user, Token: token})


    } catch (error) {
        logger.error(`Error en revalidToken-controller - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}