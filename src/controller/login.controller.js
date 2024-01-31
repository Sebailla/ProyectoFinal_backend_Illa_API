import { request, response } from 'express'
import { UserRepository } from '../repositories/index.repository.js'
import { createHash, isValidPassword } from '../utils.js'
import { generateToken } from '../config/jwt.js'

export const addUser = async (req = request, res = response) => {
    try {

        req.body.password = createHash(req.body.password)

        const result = await UserRepository.registerUser(req.body)

        const { _id, firstName, lastName, age, email, role } = result

        const token = generateToken({ _id, firstName, lastName, age, email, role })

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

        const { _id, firstName, lastName, age, role } = user

        const token = generateToken({ _id, firstName, lastName, age, email, role })

        return res.json({ msg: `User: ${user.firstName} ${user.lastName}, has been login success`, token})
    } catch (error) {
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}