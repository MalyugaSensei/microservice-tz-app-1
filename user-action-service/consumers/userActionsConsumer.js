/** @type { import('../db/models').dbModels } */
const models = require('../db/models')

/**
 * @param { import("amqplib").Channel } channel 
 */
const userActionsConsumer = async (channel) => {
    let queueName = 'user-actions'
    await channel.assertQueue(queueName, { durable: true })
    await channel.consume(queueName, async (msg) => {
        const data = JSON.parse(msg.content.toString())
        await models.UserActions.create({
            user_id: data.user_id,
            action: data.action,
            additional_data: data.additional_data
        })
    }, {
        noAck: true
    })
}

module.exports = {
    userActionsConsumer
}
