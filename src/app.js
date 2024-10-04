import express from 'express'
import dotenv from 'dotenv'
import empleadoRoutes from './routes/empleadoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import errorHandler from './middleware/errorHandler.js'
import rateLimitMiddleware from './middleware/rateLimit.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(rateLimitMiddleware)
app.use('api/empleados', empleadoRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3020
app.listen(PORT, () => {
    console.log(`Servidor Trabajando : ${PORT}`)
})