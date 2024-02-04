import { Router } from "express"
import { addUser, loginUser } from "../controller/login.controller.js"

import { check } from "express-validator"
import { emailExist } from "../helpers/DbValidation.js"
import { fieldValidate } from "../middleware/validate.middleware.js"


const router =  Router()

router.post('/register',[
    check('firstName', 'El campo "Nombre" es obligatorio').not().isEmpty(),
    check('lastName', 'El campo "Apellido" es obligatorio').not().isEmpty(),
    check('age', 'El campo "Edad" es obligatorio').not().isEmpty(),
    check('age', 'El campo "Edad" debe ser un número').isNumeric(),
    check('email', 'El campo "email" es obligatorio').not().isEmpty(),
    check('email', 'Se requiere un email válido').isEmail(),
    check('email').custom(emailExist),
    check('password', 'El campo "Password" es obligatorio').not().isEmpty(),
    check('password', 'Password requiere 8 o mas caracteres').isLength({min: 8}),
    check('password', 'Password debe contener letras y números').isAlphanumeric(),
    fieldValidate
], addUser)

router.post('/login',[
    check('email', 'El campo email es obligatorio').not().isEmpty(),
    check('email', 'Se requiere un email válido').isEmail(),
    check('password', 'Password es un campo abligatorio').not().isEmpty(),
    fieldValidate
], loginUser)

export default router
