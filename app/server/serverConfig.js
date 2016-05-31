'use strict';

/* NPM Packages*/
var Express = require('express');
var Helmet = require('helmet');
var Https = require('https');

/* Imports */
var Alerts = require('../helpers/alerts');
var Server = require('../helpers/server');

/* Global Variables */
var Router = Express.Router();
var App = new Express();

/* Functions */

exports.start = function(homeDirectory) {
  var httpPort  = process.env.port || 8080;
  var httpsPort = process.env.port || 8081;
  var options   = {
    // key:  _fs.readFileSync('./app/config/certs/privkey.pem'),
    // cert: _fs.readFileSync('./app/config/certs/cert.pem'),
    // ca:   _fs.readFileSync('./app/config/certs/chain.pem')
  };

  require('./routes/routes')(Router);
  try {
    App.use(new Helmet());
    App.use(Helmet.hidePoweredBy());

    //App.use(Server.requireHTTPS);
    App.use('/', Express.static(homeDirectory + '/bower_components'));
    App.set('view engine', 'ejs');

    var Server = Https.createServer(options, App).listen(httpsPort);
    App.listen(httpPort);
    App.use('/', Router);

    Alerts.systemMessage('Starting', '@ https://localhost:' + httpsPort + '...');

    // Database
    require('../server/databaseConfig').connect();
    //Sockets
    require('../server/socketsConfig').connect(Server);

    return App;
  } catch (error) {
    console.log(Alerts.errorMessage('Server failed to start: ', error));
  }
};
