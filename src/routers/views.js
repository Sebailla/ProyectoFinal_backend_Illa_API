import { Router } from "express"
import { addLogger, logger } from "../utils/logger.js"

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

export default router