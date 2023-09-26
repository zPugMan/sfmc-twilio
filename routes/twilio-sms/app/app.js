// Journey Builder Custom Activity -- twilio-sms Activity
// ````````````````````````````````````````````````````````````
// SERVER SIDE IMPLEMENTATION
//
// This example demonstrates
// * Configuration Lifecycle Events
//    - save
//    - publish
//    - validate
// * Execution Lifecycle Events
//    - execute
//    - stop

const express = require('express')
const configJSON = require('../config/config-json')

module.exports = function twilioSmsActivity(app, options) {
    const activityDir = `${options.rootDirectory}/routes/twilio-sms`;

    //static resources
    app.use('/routes/twilio-sms/dist', express.static(`${activityDir}/dist`));
    app.use('/routes/twilio-sms/images', express.static(`${activityDir}/images`));

    // index redirect
    app.get('/routes/twilio-sms', function(req, res) {
        return res.redirect(`/routes/twilio-sms/index.html`);
    });

    // index.html route
    app.get('/routes/twilio-sms/index.html', function(req,res) {
        return res.sendFile(`${activityDir}/html/index.html`);
    });

    // config.json ruote
    app.get('/routes/twilio-sms/config.json', function(req,res){
        return res.status(200).json(configJSON(req));
    });

    // ```````````````````````````````````````````````````````
    // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
    // ```````````````````````````````````````````````````````
    app.post('/routes/twilio-sms/save', function(req, res){
        console.log('Request to save');
        console.info('Saving: ', JSON.stringify(req.body));
        return res.status(200).json({});
    });

    app.post('/routes/twilio-sms/execute', function(req,res) {
        console.log("Request to execute..");

        const reqBody = req.body;
        console.log("Received payload: ", JSON.stringify(req.body));
        return res.status(200).json({status: "Success", errorCode: 0});
    });

    app.post('/routes/twilio-sms/publish', function(req,res){
        console.log("Request to publish..");
        console.info('Publishing: ', JSON.stringify(req.body));
        return res.status(200).json({});
    });

    app.post('/routes/twilio-sms/validate', function(req,res){
        console.log("Request to validate..");
        console.info('Validating: ', JSON.stringify(req.body));
        return res.status(200).json({});
    });

    app.post('/routes/twilio-sms/stop', function(req,res){
        console.log("Request to STOP!");
        console.info('Stopping: ', JSON.stringify(req.body));
        return res.status(200).json({});
    });

};