import ChatModel from './models/chat.model.js'

export default class Chat {
    constructor() { }

    getChat = async () => {
        return ChatModel.find()
    }

    getChatById = async (id) => {
        return ChatModel.findById(id)
    }

    addChat = async (chat) => {
        return ChatModel.create(chat)
    }

    updateChat = async (id, Chat) => {
        return ChatModel.updateOne({_id: id}, {$set: Chat})
    }

    deleteChat = async (id) =>{
        return ChatModel.deleteOne({_id: id})
    }
}