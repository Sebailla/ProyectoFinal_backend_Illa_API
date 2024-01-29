import fs from 'fs'

export default class Products {

    constructor(filename = 'products.json'){
        this.filename = filename
        if(!fs.existsSync(this.filename)){
            fs.writeFileSync(this.filename, [])
        }
    }

    get = async ()=>{
        return fs.promises.readFileSync(this.filename, {encoding: 'utf8'})
        .then(r => JSON.parse(r))
    }

    create = async (data) =>{
        const db = await this.get()
        data.id = db.length + 1
        db.push(data)
        const dbStr = JSON.stringify(db)
        return fs.promises.writeFileSync(this.filename, dbStr)
    }
}