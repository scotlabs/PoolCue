'use strict';

/* NPM Packages*/

/* Imports */

/* Global Variables */

/* Functions */
exports.connect = function(server) {
    var io = require('socket.io')(server);

    io.on('connection', function() {

    });
  };
