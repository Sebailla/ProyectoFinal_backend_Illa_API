import TicketModel from './models/ticket.model.js'

export const getTicketById = async (id) => {
    return await TicketModel.findById(id)
}

export const getTicketByEmail = async (email) => {
    return await TicketModel.findOne({ purchaser: email })
}

export const getTicketsByEmail = async (email) => {
    return await TicketModel.find({ purchaser: email })
}

export const addTicket = async (ticket) => {
    return await TicketModel.create({ ...ticket })
}