import express from 'express'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import connectDB from './db/connectDB.js'
import dotenv from 'dotenv'
import amcRoutes from './routes/amcRoutes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT||5000
connectDB()


app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/amc',amcRoutes);
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))