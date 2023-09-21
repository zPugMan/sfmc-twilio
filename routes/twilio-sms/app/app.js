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
};