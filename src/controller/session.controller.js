import { request, response } from "express";


export const postLogin = async (req = request, res = response) => {
    
    if (!req.user) {
        return res.status(400).send('Invalid credentials')
    }

    req.session.user = req.user
    req.session.role = req.user.role
    return res.redirect('/products')
}

export const postRegister = async (req = request, res = response) => {

    if(!req.user){
        console.log('error en post-Register')
        return res.redirect('/register')
    }

    return res.redirect('/login')

}


export const postLogout = async (req = request, res = response) => {
    req.session.destroy(error => {
        if (error) {
            return res.send('Error logout')
        } else {
            return res.redirect('/login')
        }
    })
}

