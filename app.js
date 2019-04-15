var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var jquery = require('jquery');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// member
var membersRouter = require('./routes/members');
// map
var mapRouter = require('./routes/map')
// session
var session = require('express-session');
var sessionRouter = require('./routes/session');
// email
var emailSend = require('./routes/emailSend');
var forgetSend = require('./routes/forgetSend')
// products
var productsRouter = require("./routes/product");
/*class and active*/
var classRouter = require("./routes/openClass");
var activeRouter = require("./routes/openActive");
// track
var trackRouter = require("./routes/track");
// order 
var orderRouter = require("./routes/order")
//couch
var coachRouter = require("./routes/coach")
//Join
var joinRouter = require("./routes/ininjoin");

var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(session({secret: "Shh, its a secret!"}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'inin/public')));

app.use('/session', sessionRouter);

app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: true,
   // cookie: { secure: true }
 }))

app.use('/mem' , membersRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/map', mapRouter);
app.use('/email', emailSend);
app.use('/forget', forgetSend)
app.use("/pro", productsRouter);
app.use("/track", trackRouter);
/*class and active */
app.use("/api", classRouter);
app.use("/api2", activeRouter);
// order
app.use("/order", orderRouter);
// coach
app.use("/coach", coachRouter);
// Join
app.use("/join", joinRouter);

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


// -----express session--------
app.get('/', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
      res.send(req.session)
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
      
   }
});

// ----------------------------

module.exports = app;
