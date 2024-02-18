import mongoose from "mongoose"

const ticketCollection = 'ticket'

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: String},
    amount: { type: Number },
    purchaser: { type: String, required: true },
    items: [{type: Object}]
})

ticketSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
})

const TicketModel = mongoose.model(ticketCollection, ticketSchema)

export default TicketModel