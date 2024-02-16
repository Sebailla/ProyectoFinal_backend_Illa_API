import { Router } from "express"
import { addLogger} from "../utils/logger.js"
import { jwtValidity } from "../middleware/auth.js"
import { mokingProducts } from "../controller/moking.controller.js"

const router = Router()

router.get('/loggerTest', addLogger, (req, res) => {
    req.logger.debug('DEBUG')
    req.logger.http('HTTP')
    req.logger.info('INFO')
    req.logger.warning('WARNING')
    req.logger.error('ERROR')
    req.logger.fatal('FATAL')

    res.send('LoggerTest')
})

router.get('/mokingProducts', jwtValidity, mokingProducts)

export default router