import express from 'express'
import dotenv from 'dotenv'
import errorHandler from './middleware/errorHandler.js'
import rateLimitMiddleware from './middleware/rateLimit.js'
import routes from './routes/index.js'
import cors from 'cors'

dotenv.config()

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(rateLimitMiddleware)
app.use('/api/v1', routes)
app.use(errorHandler)

const PORT = process.env.PORT || 3010
app.listen(PORT, () => {
    console.log(`Servidor Trabajando : ${PORT}`)
})
