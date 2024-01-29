import TicketModel from './models/ticket.model.js'

export default class Ticket {
    constructor() { }

    getTicket = async () => {
        return TicketModel.find()
    }

    getTicketById = async (id) => {
        return TicketModel.findById(id)
    }

    addTicket = async (ticket) => {
        return TicketModel.create(ticket)
    }

    updateTicket = async (id, ticket) => {
        return TicketModel.updateOne({_id: id}, {$set: ticket})
    }

    deleteTicket = async (id) =>{
        return TicketModel.deleteOne({_id: id})
    }
}