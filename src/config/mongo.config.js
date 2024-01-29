//Todo:        Conección a Mongoose

import mongoose from 'mongoose'
import config from './config.js'

//Conección a BD
export const dbConnection = async () => {
  try {
    await mongoose.connect(config.urlMongoDb, { dbName: config.dbName })
    console.log('DB conectada satifactoriamente')
  } catch (error) {
    console.log('Error de coneccion a Datos: ' + err)
    process.exit(1)
  }
}
