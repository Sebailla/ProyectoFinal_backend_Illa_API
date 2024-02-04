import { validationResult } from 'express-validator'


export const fieldValidate = (req = request, res = response, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json(error)
    }
    next()
}

