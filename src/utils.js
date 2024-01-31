import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

// Create Hash
export const createHash = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

// Validate Hash
export const isValidPassword = (password, userPassword)  => {
    return bcrypt.compareSync(password, userPassword)
}

//Validar extención de Archivos

export const validFileExtension = (originalname = '') => { 
    const valid = ['png','jpg','jpeg']
    const validExtension = originalname.split('.')
    const extension = validExtension[validExtension.length -1]
    if(valid.includes(extension.toLocaleLowerCase())){
        return true
    } return false
    
}
