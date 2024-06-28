const amqp = require('amqplib')

/** @type { import('amqplib').Channel } */
let channel;
/** @type { import('amqplib').Connection } */
let connection;

const connectMQ = async () => {
    try {
        if (!connection) {
            connection = await amqp.connect(process.env.RABBITMQ_URL)
            console.log(`Successful connection to RabbitMQ`)

            connection.on('error', (err) => {
                if (err.message.includes('Connection closed')) {
                    console.error('Connection closed, reconnecting...');
                    setTimeout(connectMQ, 5000); // Retry connection after a delay
                } else {
                    console.error('Unexpected RabbitMQ error:', err);
                }
            })
        }

        if (!channel) {
            channel = await connection.createChannel()
            channel.prefetch(1)
            console.log(`Successful channel creation`)
        }

        return { channel, connection }
    } catch (error) {
        console.error('Cannot connect to RabbitMQ server. reconnecting...');
        console.error(error)
        await new Promise(resolve => setTimeout(resolve, 5000))
        return connectMQ()
    }
}

/**
 * Gets the current channel or throws an error if not connected
 * @returns {Promise<import('amqplib').Channel>}
 */

const getChannel = async () => {
    if (!channel) {
        await connectMQ();
    }
    if (!channel) {
        throw new Error('Cannot establish a channel to RabbitMQ');
    }
    return channel;
}

const closeConnection = async () => {
    if (connection) {
        await connection.close();
    }
}

module.exports = {
    connectMQ,
    getChannel,
    closeConnection
}