/** @type { import('../../db/models').dbModels } */
const models = require('../../db/models')

/**
 * @param { import("amqplib").Channel } channel 
 */
const userActionsConsumer = async (channel) => {
    let queueName = 'user-actions'
    await channel.assertQueue(queueName, { durable: true })
    await channel.consume(queueName, async (msg) => {
        console.log('[consumer] Received message')
        const data = JSON.parse(msg.content.toString())
        if (!Array.isArray(data)) {
            await models.UserActions.create(data)
        } else {
            await models.UserActions.bulkCreate(data)
        }
        console.log('[consumer] User action created')
    }, {
        noAck: true
    })
}

module.exports = {
    userActionsConsumer
}
