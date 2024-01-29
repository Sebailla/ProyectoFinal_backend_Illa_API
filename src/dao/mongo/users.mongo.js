import UserModel from './models/users.model.js'

export const getUserById = async (id) => {
    return await UserModel.findById(id)
}

export const getUserByEmail = async (email) => {
    return await UserModel.findOne({ email })
}

export const registerUser = async (user) => {
    return await UserModel.create({ ...user })
}