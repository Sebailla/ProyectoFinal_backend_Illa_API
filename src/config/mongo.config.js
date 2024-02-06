//?        Conección a Mongoose

import mongoose from 'mongoose'
import config from './config.js'
import {logger} from '../utils/logger.js'



//Conección a BD
export const dbConnection = async () => {
  try {
    await mongoose.connect(config.urlMongoDb, { dbName: config.dbName })
    logger.info(`Base de Dato conectada satifactoriamente - ${new Date().toLocaleString()}`)
  } catch (error) {
    logger.error(`Error al conectar con Base de Datos - ${new Date().toLocaleString()}` + error)
    process.exit(1)
  }
}