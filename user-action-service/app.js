require('dotenv').config()

const express = require('express')
const cors = require('cors')
const userActionRouter = require('./routes/userActions')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*',
    credentials: true
}))

app.use('/user-actions', userActionRouter)

module.exports = app



