const azureSender = require('../../lib/azureSender');
// const fs = require('fs');
// const Path = require('path');

// function readTestFile(file) {
//     return new Promise(function (resolve, reject){
//         fs.readFile(file, 'utf8', function (err, data) {
//             if (err) {
//                 console.error("Failed to load file: ", file);
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         });
//     });
// }

// async function loadFile(file) {
//     try {
//         let result = await readTestFile(file);
//         return result;
//     } catch (error) {
//         console.error(error);
//     }
// }

test('azureSender.formMessage()', () => {
    //TODO load from sample payloads
    // let rawJson = Path.join(__dirname,'../payloads/','execute-payload1.json');
    // console.info("Path: ", rawJson);

    const testJson = 
    {
        inArguments: [
            {
                smsKeyword: "HitUP!",
                smsPhone: "8846597894",
                smsMessage: "Hi there Tester! This is a test."
            }
        ],
        outArguments: [],
        activityObjectID: "62d6fed2-511e-4720-a309-7e393decd33e",
        journeyId: "a4dcaf9f-e967-4b14-8159-d4c88d5c7462",
        activityId: "62d6fed2-511e-4720-a309-7e393decd33e",
        definitionInstanceId: "cec6e0a0-9761-463d-a159-eeb7ee4a8a51",
        activityInstanceId: "3be6161f-77b3-4dfd-b986-bd0787ee6b0c",
        keyValue: "testemail123@gmail.com",
        mode: 0
    };

    let result = azureSender.formMessage(testJson);

    expect(result.contentType).toBe('application/json');
    expect(result.body).toBe(testJson);
    expect(result.correlationId).toBe(testJson.activityInstanceId);

})