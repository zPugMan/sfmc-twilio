module.exports = function configJSON(req) {
    return {
        workflowApiVersion: '1.1',
        metaData: {
          // the location of our icon file
          icon: 'images/twilio-icon.png',
          category: 'message'
        },
        // For Custom Activity this must say, "REST"
        type: 'REST',
        lang: {
          'en-US': {
            name: 'Twilio v3',
            description: 'Sends SMS via Twilio'
          }
        },
        arguments: {
          execute: {
            // See: https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/how-data-binding-works.htm
            inArguments: [
              {
                smsKeyword: ""
              },
              {
                smsPhone: ""
              },
              {
                smsMessage: ""
              }
            ],
            outArguments: [],
            // Fill in the host with the host that this is running on.
            // It must run under HTTPS
            url: `https://${req.headers.host}/routes/twilio-sms/execute`,
            // The amount of time we want Journey Builder to wait before cancel the request. Default is 60000, Minimal is 1000
            timeout: 10000,
            // how many retrys if the request failed with 5xx error or network error. default is 0
            retryCount: 3,
            // wait in ms between retry.
            retryDelay: 1000,
            // The number of concurrent requests Journey Builder will send all together
            concurrentRequests: 5,
            format: "JSON",
            useJwt: process.env.JWT_ENABLED ? process.env.JWT_ENABLED : false,
            customerKey: process.env.SALT_EXTERNAL_KEY ? process.env.SALT_EXTERNAL_KEY : ""
          }
        },
        configurationArguments: {
          publish: {
            url: `https://${req.headers.host}/routes/twilio-sms/publish`
          },
          validate: {
            url: `https://${req.headers.host}/routes/twilio-sms/validate`
          },
          stop: {
            url: `https://${req.headers.host}/routes/twilio-sms/stop`
          }
        },
        userInterfaces: {
          configurationSupportsReadOnlyMode : true,
          configInspector: {
            size: 'scm-lg',
            emptyIframe: true
          }
        },
        schema: {
          arguments: {
            execute: {
              inArguments: [{
                smsKeyword: 
                {
                  dataType: 'Text',
                  direction: 'in',
                  access: 'visible'
                },
                smsPhone: 
                {
                  dataType: 'Text',
                  direction: 'in',
                  access: 'visible'
                },
                smsMessage: 
                {
                  dataType: 'Text',
                  direction: 'in',
                  access: 'visible'
                }
             }],
              outArguments: [{
                status: {
                  dataType: 'Text',
                  direction: 'out',
                  access: 'visible'
                },
                errorCode: {
                  dataType: 'Number',
                  direction: 'out',
                  access: 'visible'
                },
                errorMessage: {
                    dataType: 'Text',
                    direction: 'out',
                    access: 'visible'
                }
              }]
            }
          }
        }
      };
    };