import { TicketDao } from "../dao/factory.js"

export const getTicketById = async (id) => {
    return await TicketDao.getTicketById(id)
}

export const getTicketByEmail = async (email) => {
    return await TicketDao.getTicketByEmail(email)
}

export const addTicket = async (ticket) => {
    return await TicketDao.addTicket(ticket)
}