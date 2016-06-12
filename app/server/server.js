'use strict';

/* NPM Packages*/
var Compression = require('compression');
var BodyParser  = require('body-parser');
var Express     = require('express');
var Helmet      = require('helmet');
var Https       = require('https');
var Http        = require('http');

/* Imports */
var Logger = require('../helpers/logger');

/* Global Variables */
var Router = Express.Router();
var App = new Express();

/* Functions */

exports.start = function(homeDirectory) {
    // Database
    require('../server/database').connect();
    // Routes
    require('./routes/routes')(Router, Logger);
    // Port config
    var httpPort  = process.env.port || 8080;
    var httpsPort = process.env.port || 8081;
    if (process.env.NODE_ENV == 'production') {
      httpPort = 80;
      httpsPort = 443;
      var options   = {
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
      //App.use(Server.requireHTTPS);
      // Static Files
      App.use('/', Express.static(homeDirectory + '/bower_components'));
      App.use('/', Express.static(homeDirectory + '/app/public'));
      Express.static(homeDirectory + '/public');

      App.set('view engine', 'ejs');
      App.use(BodyParser.urlencoded({extended: true}));
      App.use('/', Router);

      var Server = Http.createServer(App).listen(httpPort);

      var sockets = require('../server/sockets');
      sockets.connect(Server);

      Logger.info('Starting server @ https://localhost:' + httpPort);

      return App;

    } catch (error) {
      Logger.fatal('Server failed to start: ' + error);
    }
  };
