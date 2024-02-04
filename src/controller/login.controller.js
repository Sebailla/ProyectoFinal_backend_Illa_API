import { request, response } from 'express'
import { CartRepository, UserRepository } from '../repositories/index.repository.js'
import { createHash, isValidPassword } from '../utils.js'
import { generateToken } from '../config/jwt.js'

export const addUser = async (req = request, res = response) => {
    try {
        //Hash de password
        req.body.password = createHash(req.body.password)

        // Creamos Cart asociado a User
        const cart = await CartRepository.addCart()

        if (!cart) {
            return res.status(500).json({ msg: 'Cart not found' })
        } else {
            req.body.cart_id = cart
        }
        //Creamos User
        const result = await UserRepository.registerUser(req.body)

        //Generamos Token
        const { _id, firstName, lastName, age, email, role, cart_id } = result

        const token = generateToken({ _id, firstName, lastName, age, email, role, cart_id })

        return res.json({ msg: `New User: ${firstName} ${lastName}, added success`, token })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}

export const loginUser = async (req = request, res = response) => {
    try {
        const { email, password } = req.body

        const user = await UserRepository.getUserByEmail(email)

        if (!user) {
            return res.status(400).json({ msg: 'User y/o Password son incorrectos' })
        }

        const validPassword = isValidPassword(password, user.password)

        if (!validPassword) {
            return res.status(400).json({ msg: 'User y/o Password son incorrectos' })
        }

        const { _id, firstName, lastName, age, role, cart_id } = user

        const token = generateToken({ _id, firstName, lastName, age, email, role, cart_id })

        return res.json({ msg: `User: ${user.firstName} ${user.lastName}, has been login success`, token, user })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}