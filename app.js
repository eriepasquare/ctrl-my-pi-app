var fs = require('fs');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , TwitterStrategy  = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;


var agent = require('./routes/agent');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_ID,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK
  }, function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }));


// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(null); }
  res.redirect('/error')
}

// create the express application
var app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

app.get("/",function(req,res){
  res.render(__dirname + "/app/index.html", { user: req.user })
})

app.use('/agent', agent);

app.get('/login',
  function(req, res){
    res.redirect('/#!/logins');
  });

app.get('/login/facebook', passport.authenticate('facebook'));
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login/error' }),
  function(req, res) {
    console.log("New user login:");
    console.log(req.user);
    res.redirect('/#!/lights');
  });

app.get('/login/google',
        passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));
app.get('/login/google/return',
  passport.authenticate('google', { failureRedirect: '/login/error' }),
  function(req, res) {
    console.log("New user login:");
    console.log(req.user);
    res.redirect('/#!/lights');
  });

app.get('/login/twitter', passport.authenticate('twitter'));
app.get('/login/twitter/return',
  passport.authenticate('twitter', { failureRedirect: '/login/error' }),
  function(req, res) {
    console.log("New user login:");
    console.log(req.user);
    res.redirect('/#!/lights');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.setHeader('Content-Type', 'application/json');
    console.log("req.user: ");
    console.log(req.user);
    res.render('profile', { user: req.user });
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.setHeader('Content-Type', 'application/json');
  res.render('error');
});


module.exports = app;
