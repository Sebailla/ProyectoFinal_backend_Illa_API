// Dependencies Imports
import express from 'express'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import { addLogger, logger } from './utils/logger.js'
import cors from 'cors'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

//Variables de entorno
import config from './config/config.js'
//Routers
import ProductsRouter from './routers/products.js'
import CartRouter from './routers/cart.js'
import LoginRouter from './routers/login.js'
import ViewsRouter from './routers/views.js'
import UsersRouter from './routers/user.js'
import TicketRouter from './routers/ticket.js'

import { dbConnection } from './config/mongo.config.js'
import chatModel from './dao/mongo/models/chat.model.js'
import { ProductRepository } from './repositories/index.repository.js'


// Variables
const app = express()
app.use(addLogger)
app.use(cors())

const swaggerOption = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: 'Documentación API Proyecto final Ecommerce',
            description: '',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`],    
}

const specs = swaggerJsDoc(swaggerOption)


// Rutas urls
app.use(express.static((__dirname + '/public')))

// Data para POST json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Conección a BD MongoDB
await dbConnection()

//? --- Router --- 
app.use('/api/login', LoginRouter)
app.use('/api/products', ProductsRouter)
app.use('/api/carts', CartRouter)
app.use('/api/users', UsersRouter)
app.use('/api/tickets', TicketRouter)
app.use('/', ViewsRouter)
// Swagger Router
app.use('/apiDocument', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


// Express Server
const httpServer = app.listen(config.port, () => console.log('listening on port 8080 ...'))

// WebSocket Server
const io = new Server(httpServer)

//?  WebSocket connection
//-------------------------------------------------
io.on('connection', async (socket) => {

    logger.info(`New Client connected on front - ${new Date().toLocaleString()}`)

    socket.on('disconnect', () => {
        logger.info(`Cliente sin conección - ${new Date().toLocaleString()}`)
    })

    //? Productos
    // Enviamos productos al Cliente
    const { payload } = await ProductRepository.getProducts({ limit: 10000 })
    const products = payload
    socket.emit('getProducts', payload)

    // Agregamos productos
    socket.on('postProducts', async (productData) => {
        const newProduct = await ProductRepository.addProduct({ ...productData })
        if (newProduct) {
            products.push(newProduct)
            socket.emit('postProducts', products)
        }

    })


    //? Chat

    const messages = await chatModel.find();
    socket.emit('message', messages);

    socket.on('message', async (data) => {
        const newMessage = await chatModel.create({ ...data });
        if (newMessage) {
            const messages = await chatModel.find();
            io.emit('messageLogs', messages)
        }
    });

    socket.broadcast.emit('newUser');
})