'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Imports */
var Alerts = require('../helpers/alerts');

/* Global Variables */

/* Functions */
exports.connect = function() {
  Mongoose.connect('mongodb://localhost:27017/EloEloElo');
  var db = Mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    Alerts.systemMessage('Database', 'connecting...');
  });
};
