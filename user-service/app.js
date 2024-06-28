require('dotenv').config()

const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/users')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*',
    credentials: true
}))

app.use('/users', userRouter)

module.exports = app



