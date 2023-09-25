var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//support Azure AppInsights
let appInsights = require('applicationinsights');
var appInsightsDSN = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
if (appInsightsDSN)  {
  console.info("Retreived app insights DSN");
  appInsights.setup(appInsightsDSN)
    .setAutoCollectConsole(true, true)    //enables console.log requests
    .start();
} else {
  console.error("Failed to retrieve app insights DSN from environment");
}


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const bodyParser = require('body-parser');
const customModules = [
  require('./routes/twilio-sms/app/app')
];

var app = express();

//support application/json
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

customModules.forEach((cm)=> cm(app, {
  rootDirectory: __dirname,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
