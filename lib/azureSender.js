'use strict';

const azureSvcBusClient = require('@azure/service-bus');
const busConnectString = process.env.AZURE_SEND_BUS;
const sendQueueName = process.env.AZURE_SEND_QUEUE;
const {v4: uuidv4 } = require('uuid');

const messageSubject = 'SFMC-TWILIO';

module.exports = {
    
    sendPayload: async function(busMsg) {
        console.info("Sending ServiceBus message");
        if (!busMsg) {
            throw new Error('No message to send');
        }

        if (!busConnectString) {
            throw new Error('Failed to retrieve AZURE_SEND_BUS connection string');
        }

        if(!sendQueueName) {
            throw new Error('Failed to retrieve AZURE_SEND_QUEUE connection string');
        }

        console.log("Instantiating client -- ", Date.now());
        const sbClient = new azureSvcBusClient.ServiceBusClient(busConnectString);
        console.log("Instantiating client done -- ", Date.now());
        console.log("Instantiating sender -- ", Date.now());
        const sbSender = sbClient.createSender(sendQueueName);
        console.log("Instantiating sender done -- ", Date.now());

        try {
            console.log("Using sender -- ", Date.now());
            await sbSender.sendMessages(busMsg);
            console.log("Using sender done -- ", Date.now());
        } finally {
            console.log("Closing client -- ", Date.now());
            await sbClient.close();
            console.log("Closing client done -- ", Date.now());
        }
    },

    formMessage: function(payload) {
        console.info("Forming ServiceBus message");
        if (Object.keys(payload).length === 0) {
            throw new Error('No payload to transform');
        }

        return {
                applicationProperties: {},
                body: payload,
                contentType: "application/json",
                correlationId: payload.activityInstanceId,
                messageId: uuidv4(),
                subject: messageSubject
            };
    }

}