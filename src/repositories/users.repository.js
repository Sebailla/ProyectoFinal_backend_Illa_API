import { UserDao } from "../dao/factory.js"

export const getUserById = async (uid) => {
    return await UserDao.getUserById(uid)
}

export const getUserByEmail = async (email) => {
    return await UserDao.getUserByEmail(email)
}

export const registerUser = async (user) => {
    return await UserDao.registerUser(user)
}