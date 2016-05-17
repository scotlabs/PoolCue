'use strict';

/* NPM Packages*/
var Express = require('express');
var Helmet = require('helmet');
var Https = require('https');

/* Imports */
var Alerts = require('../helpers/alerts');

/* Global Variables */
var router = Express.Router();
var app = new Express();

/* Functions */

exports.start = function() {
  var httpPort  = process.env.port || 8080;
  var httpsPort = process.env.port || 8081;
  var options   = {
    // key:  _fs.readFileSync('./app/config/certs/privkey.pem'),
    // cert: _fs.readFileSync('./app/config/certs/cert.pem'),
    // ca:   _fs.readFileSync('./app/config/certs/chain.pem')
  };

  require('./routes/routes')(router);
  try {
    app.use(new Helmet());
    app.use(Helmet.hidePoweredBy());

    Https.createServer(options, app).listen(httpsPort);
    app.listen(httpPort);
    app.use('/', router);

    Alerts.systemMessage('Starting', '@ https://localhost:' + httpsPort + '...');

    return app;
  } catch (error) {
    console.log(Alerts.errorMessage('Server failed to start: ', error));
  }
};
