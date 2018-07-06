var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
require('./src/db/dbConnection');

var reservation = require('./src/controllers/reservationController');

var app = express();
var graphqlHTTP = require('express-graphql');
var {schema} = require('./src/graphql/schema');
var {root} = require('./src/graphql/resolver');

// view engine setup
// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Cors setting
 */
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', function (req, res) {
   res.send({
        status: 200,
        message: 'OK'
    });
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  formatError(err) {   // <-- log the error
    return {
      message: err.message,
      //code: err.originalError && err.originalError.code,   // <--
      //locations: err.locations,
      //path: err.path
    };
  }
}));

app.get('/reservations', reservation.getAll); //3 & 4
app.get('/reservation/:id', reservation.getById); //1
app.post('/reservation', reservation.create); //2
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    // console.log("In error");
    res.render('index');
   /*  var err = new Error('Not Found');
    err.status = 404;
    next(err); */
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;