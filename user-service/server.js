require('dotenv').config()

const { sequelize } = require('./db/models')
const { connectMQ } = require('./amqp/connect')
const app = require('./app')

const port = process.env.PORT || 3000

const startApp = async () => {
    try {
        await sequelize.authenticate()
        console.log('\nConnection to DB has been established successfully.\n')
    } catch (error) {
        console.error('\nUnable to connect to the database:\n', error)
    }

    try {
        await connectMQ()
            .then(({ channel }) => {
                channel.assertQueue("user-actions", { durable: true })
            })
            .catch(error => {
                console.error('Unable to connect to RabbitMQ:', error)
            })
        console.log('Connection to RabbitMQ has been established successfully.')
    } catch (error) {
        console.error('\nUnable to connect to RabbitMQ:\n', error)
    }

    try {
        app.listen(port, () => {
            console.log(`\nExample app listening at http://localhost:${port}\n`)
        })
    } catch (error) {
        console.error('\nUnable to start App:\n', error)
    }
}

startApp()




