/**
 * Created by Daniel on 8/22/2014.
 */

// server.js

// modules ==============================
var express         = require('express');
var app             = express();
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
// configuration ========================

// config files
var db = require('./config/db');

var port = process.env.PORT || 8080;

// get all data/stuff of the body
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(morgan('dev'));
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
var http = require('http'),
    server = http.createServer(app),
    io = require("socket.io")(server);

require('./app/routes')(app,io); // configure our routes

require('newrelic');


// model ===================================================


server.listen(port);
					// startup our app at http://localhost:8080
console.log('Magic happens on port ' + port); 	// shoutout to the user
exports = module.exports = app;

// start app ===============================================
