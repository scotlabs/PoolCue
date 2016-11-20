'use strict';

/* NPM Packages*/
var Compression = require('compression');
var BodyParser = require('body-parser');
var Express = require('express');
var Helmet = require('helmet');
var Https = require('https');
var Http = require('http');

/* Imports */
var Logger = require('./helpers/logger');
var ServerHelper = require('./helpers/server');
var Sockets = require('./sockets');

/* Global Variables */
var Router = Express.Router();
var App = new Express();

/* Setting Validation */

/* Functions */

exports.start = function (homeDirectory) {
	
	// Database
	require('./database').connect();
	// Routes
	require('./routes/routes')(Router, Logger);
	// Port config

	var httpPort = 8080;
	var httpsPort = 8081;
	var options = {};
	if (process.env.NODE_ENV == 'production') {
		httpPort = process.env.port;
		httpsPort = process.env.port;
		options = {
			// key:  _fs.readFileSync('./app/config/certs/privkey.pem'),
			// cert: _fs.readFileSync('./app/config/certs/cert.pem'),
			// ca:   _fs.readFileSync('./app/config/certs/chain.pem')
		};
	}

	try {
		// Security
		App.use(new Helmet());
		App.use(Helmet.hidePoweredBy());

		// Compression
		App.use(Compression());

		// Static Files
		App.use('/scripts/', Express.static(homeDirectory + '/bower_components'));
		App.use('/app', Express.static(homeDirectory + '/app'));
		App.use('/', Express.static(homeDirectory + '/bower_components'));
		App.use('/images/', Express.static(homeDirectory + '/images'));
		App.use('/', Express.static(homeDirectory + '/app/public'));
		App.use('/', Express.static(homeDirectory + '/public'));

		App.set('view engine', 'ejs');
		App.use(BodyParser.urlencoded({
			extended: true
		}));
		App.use('/', Router);

		var Server = Http.createServer(App);
		var io = require('socket.io').listen(Server);
		Sockets.connect(io);

		Server.listen(httpPort, function () {
			Logger.info('Starting server @ http://localhost:' + httpPort);
		});

		return App;

	} catch (error) {
		Logger.fatal('Server failed to start: ' + error);
	}
};
