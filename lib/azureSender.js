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

        const sbClient = new azureSvcBusClient.ServiceBusClient(busConnectString);
        const sbSender = sbClient.createSender(sendQueueName);

        try {
            await sbSender.sendMessages(busMsg);  //TODO 800-1000ms
        } finally {
            await sbClient.close();     //TODO 200ms
        }
    },

    formMessage: function(payload) {
        console.info("Forming ServiceBus message");
        if (Object.keys(payload).length === 0) {
            throw new Error('No payload to transform');
        }

        return {
                applicationProperties: {},
                body: {
                    source: "SFMC",
                    to: payload.inArguments[0].smsPhone,
                    message: payload.inArguments[0].smsMessage,
                    trackingID: payload.activityInstanceId
                }, 
                contentType: "application/json",
                correlationId: payload.activityInstanceId,
                messageId: uuidv4(),
                subject: messageSubject
            };
    }

}