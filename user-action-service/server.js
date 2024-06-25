const express = require('express')
const cors = require('cors')
const { sequelize } = require('./db/models')
const userActionRouter = require('./routes/userActions')
const { connectMQ } = require('amqp/connect')
const { userActionsConsumer } = require('consumers/userActionsConsumer')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*',
    credentials: true
}))

app.use('/user-actions', userActionRouter)

try {
    sequelize.authenticate()
    console.log('Connection has been established successfully.')

    connectMQ()
        .then(({ channel }) => {
            userActionsConsumer(channel)
        })
    console.log('Connection to RabbitMQ has been established successfully.')

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
} catch (error) {
    console.error('Unable to start App:', error)
}
