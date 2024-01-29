export default class Products{
    constructor(){
        this.db = []
    }

    get = async () =>{
        return this.db
    }

    create = async (data) =>{
        data.id = db.length + 1
        this.db.push(data)
        return data
    }
}