import { Router } from "express"
import { addLogger} from "../utils/logger.js"
import { uploader } from '../config/multer.config.js'
import { admin, jwtValidity} from '../middleware/auth.js'
import { premiumUser } from "../controller/login.controller.js"
//import { fieldValidate} from "../middleware/validate.middleware.js"

const router = Router()

router.get('/premium/:uid', [addLogger, jwtValidity, admin, uploader.single('file')], premiumUser)

router.post('/:uid', [addLogger, jwtValidity, uploader.single('file')], )

export default router