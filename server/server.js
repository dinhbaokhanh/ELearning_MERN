import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth/authRoutes.js'
import mediaRoutes from './routes/instructor/mediaRoutes.js'
import adminRoutes from './routes/admin/adminRoutes.js'
import instructorCourseRoutes from './routes/instructor/courseRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json())

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Database is connected'))
  .catch((e) => console.log(e))

app.use('/auth', authRoutes)
app.use('/media', mediaRoutes)
app.use('/instructor/course', instructorCourseRoutes)
app.use('/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`)
})
