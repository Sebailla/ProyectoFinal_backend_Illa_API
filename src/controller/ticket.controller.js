import { request, response } from 'express';
import { TicketRepository } from '../repositories/index.repository.js';

export const getTickets = async (req = request, res = response) => {
    try {
        const email = req.email;
        const tickets = await TicketRepository.getTicketsByEmail(email);
        return res.json({tickets});
    } catch (error) {
        logger.error(`Error en getTickets - ${new Date().toLocaleString()}`)
        return res.status(500).json({ msg: 'Error en servidor' })
    }
}