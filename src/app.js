// Dependencies Imports
import express from 'express'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import { addLogger, logger } from './utils/logger.js'
import cors from 'cors'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import http from 'http'

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

// WebSocket Server
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        //origin: config.originWebSicketDev
        origin: config.originWebSocketProd
    }
})

//?  WebSocket connection
//-------------------------------------------------

io.on('connection', socket => {
    console.log('Cliente conectado')

    socket.on('mensaje', data => {
        console.log({ data })

        socket.broadcast.emit('mensaje', data)
    })
})

server.listen(config.port, () => { logger.info(`Corriendo aplicacion en el puerto ${config.port}`) })

