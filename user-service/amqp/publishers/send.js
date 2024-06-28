const { getChannel } = require("../connect");

const sendDataToQueue = async (queueName, data) => {
    const channel = await getChannel();
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
}

module.exports = {
    sendDataToQueue
}