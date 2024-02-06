import winston from 'winston'
import config from '../config/config.js'

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    color: {
        fatal: 'red',
        error: 'brightRed',
        warning: 'Yellow',
        info: 'white',
        http: 'cyan',
        debug: 'blue'
    }
}

winston.addColors(customLevelOptions.color)

const transport = []

if(config.nodeEnv !== 'production'){
    transport.push(
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple(),
                winston.format.timestamp()
            )
        })
    )
}else{
    transport.push(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple(),
                winston.format.timestamp()
            )
        }),
        new winston.transports.File({
            level: 'error',
            format: winston.format.json(),
            filename: './errors.log'
        })
    )
}

export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: transport
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`[${req.method}] ${req.url} - ${new Date().toLocaleString()}`)
    next()
}