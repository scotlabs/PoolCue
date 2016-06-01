'use strict';

/* NPM Packages*/

/* Imports */
var Logger = require('../helpers/logger');

/* Global Variables */

/* Functions */
exports.connect = function(server) {
    var io = require('socket.io')(server);
    Logger.info('Starting sockets.');

    io.on('connection', function() {

    });
  };
