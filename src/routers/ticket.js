import {Router} from 'express'
import { jwtValidity } from '../middleware/auth.js'
import { getTickets } from '../controller/ticket.controller.js'

const router = Router()

router.get('/', jwtValidity, getTickets)

export default router