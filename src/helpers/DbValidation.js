import { UserRepository } from "../repositories/index.repository.js"

export const emailExist = async (email)=>{
        const result =  await UserRepository.getUserByEmail(email)
        if(result){
            throw new Error(`El email: ${email}, ya se encuentra registrado`)
        }

}