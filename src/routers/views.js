import { Router } from 'express'
import passport from 'passport'

//?  Midleware
import { admin, auth } from '../middleware/auth.js'
import { isSessionActive } from '../middleware/isSessionActive.js'

//? Controlers
import { addProductView, cartIdView, chatView, loginView, logoutView, productsView, realTimeProductsView, registerView, rootView } from '../controller/views.controller.js'
import { postLogin } from '../controller/session.controller.js'
import { uploader } from '../config/multer.config.js'
import { addProduct } from '../controller/products.controller.js'

//?----------------------------------------------

const router = Router()

//?  Routs Renders

router.get('/', [isSessionActive], rootView)
router.get('/login', [isSessionActive], loginView)
router.get('/register', [isSessionActive], registerView)

//? Logout 

router.get('/logout', logoutView)

//? Router products

router.get('/products', [auth], productsView)
router.get('/realtimeproducts', [auth, admin], realTimeProductsView)
router.get('/carts/:cid', [auth], cartIdView)
router.get('/chat', [auth], chatView)

router.get('/addProduct', [auth, admin], addProductView)
router.post('/addProduct', [auth, uploader.single('file')], addProduct )


//? Router GitHub Login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/register'}), postLogin)


router.get('*', (req, res) => {
    return res.render('404')
})


export default router

