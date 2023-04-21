import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import authRoute from './routes/auth.js'

const app = express()
dotenv.config()

// constants
const PORT = process.env.PORT || 3002
const db_user = process.env.DB_USER
const db_password = process.env.DB_PASSWORD
const db_name = process.env.DB_NAME

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/api/auth', authRoute)

async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${db_user}:${db_password}@cluster0.mc4sdak.mongodb.net/${db_name}?retryWrites=true&w=majority`
        )

        app.listen(PORT, () => {
        console.log(`server started on port: ${PORT}`)
        console.log('connected to db')
        })
    }
    catch (error) {
        console.log(error)
    }
}
start()



