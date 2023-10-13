'use strict';

const azureSvcBusClient = require('@azure/service-bus');
const busConnectString = process.env.AZURE_SEND_BUS;
const sendQueueName = process.env.AZURE_SEND_QUEUE;
const {v4: uuidv4 } = require('uuid');

const messageSubject = 'SFMC-TWILIO';

module.exports = {
    
    sendPayload: async function(busMsg, callback) {
        if (!busMsg) {
            return callback(new Error('No message to send'));
        }

        if (!busConnectString) {
            return callback(new Error('Failed to retrieve AZURE_SEND_BUS connection string'));
        }

        if(!sendQueueName) {
            return callback(new Error('Failed to retrieve AZURE_SEND_QUEUE connection string'));
        }

        const sbClient = new azureSvcBusClient.ServiceBusClient(busConnectString);
        const sbSender = sbClient.createSender(sendQueueName);

        try {
            await sbSender.sendMessages(busMsg);
        } finally {
            await sbClient.close();
        }
    },

    formMessage: function(payload, callback) {
        if (!payload) {
            return callback(new Error('No payload to transform'));
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