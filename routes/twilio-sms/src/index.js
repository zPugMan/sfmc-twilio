import Postmonger from 'postmonger';

//create connection for the JourneyBuilder session
const connection = new Postmonger.Session();

//activity store
let activity = null;

document.addEventListener('DOMContentLoaded', function main() {
    //test harness
    // setupTestHarness();

    //UI event handlers
    setupEventHandlers();

    //bind initActivity event
    connection.on('initActivity', onInitActivity);

    //tell JourneyBuilder ready
    connection.trigger('ready');
});

function onInitActivity(payload){
    activity = payload;

    const hasArgs = Boolean(
        activity.arguments &&
        activity.arguments.execute &&
        activity.arguments.execute.inArguments &&
        activity.arguments.inArguments.length > 0
    );

    const inArgs = hasArgs ? activity.ar.execute.inArgs : [];

    console.log('-------- triggered:onInitActivity({obj}) --------');
    console.log('activity:\n ', JSON.stringify(activity, null, 4));
    console.log('Has In Arguments: ', hasInArguments);
    console.log('inArguments', inArguments);
    console.log('-------------------------------------------------');

    const smsKeywordArg = inArgs.find((arg)=> arg.smsKeyword);

    if (smsKeywordArg) {
        //TODO set SMS keyword for value when returning
    }
}

function setupEventHandlers() {
    //change events from form
    document.getElementById('sms-keyword-id').addEventListener('change', onSmsKeywordChange);

    //button events
    document.getElementById('done').addEventListener('click', onDoneButtonClick);
    document.getElementById('cancel').addEventListener('click', onCancelButtonClick);
}

function onSmsKeywordChange() {
    //TODO add done enable/disable based on value present

    connection.trigger('setActivityDirtyState', true);
}

function onCancelButtonClick() {
    // tell Journey Builder that this activity has no changes.
    connection.trigger('setActivityDirtyState', false);

    // now request that Journey Builder closes the inspector/drawer
    connection.trigger('requestInspectorClose');
}

function onDoneButtonClick() {
    // we set must metaData.isConfigured in order to tell JB that
    // this activity is ready for activation
    activity.metaData.isConfigured = true;

    // get the option that the user selected and save it to
    const smsElement = document.getElementById('sms-keyword-id');

    activity.arguments.execute.inArguments = [{
        smsKeyword: smsElement.value,
    }];

    // you can set the name that appears below the activity with the name property
    activity.name = `Issue ${activity.arguments.execute.inArguments[0].smsKeyword}% Code`;

    console.log('------------ triggering:updateActivity({obj}) ----------------');
    console.log('Sending message back to updateActivity');
    console.log('saving\n', JSON.stringify(activity, null, 4));
    console.log('--------------------------------------------------------------');

    connection.trigger('updateActivity', activity);
}