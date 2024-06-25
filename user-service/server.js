const express = require('express')
const cors = require('cors')
const { sequelize } = require('./db/models')
const userRouter = require('./routes/users')
const { connectMQ } = require('amqp/connect')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*',
    credentials: true
}))

app.use('/users', userRouter)

try {
    sequelize.authenticate()
    console.log('Connection has been established successfully.')

    connectMQ()
        .then(({ channel }) => {
            channel.assertQueue("user-actions", { durable: true })
        })
    console.log('Connection to RabbitMQ has been established successfully.')

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
} catch (error) {
    console.error('Unable to start App:', error)
}




