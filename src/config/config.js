import dotenv from 'dotenv'

dotenv.config()

export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT,
    urlMongoDb: process.env.URL_MONGODB,
    dbName: process.env.DB_NAME,

    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.CALLBACK_URL,

    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,

    jwtSecretKey: process.env.JWT_SECRET_KEY,
    nodeEnv: process.env.NODE_ENV,

    passEmail: process.env.PASS_EMAIL,
    userEmail: process.env.USER_EMAIL,

    urlPasswordReset: process.env.URL_PASSWORD_RESET,

    mpAccessToken: process.env.MP_ACCESS_TOKEN,
}
