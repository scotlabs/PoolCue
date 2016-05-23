'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Imports */
var Alerts = require('../helpers/alerts');

/* Global Variables */

/* Functions */
exports.connect = function() {
  var connectionString = 'mongodb://localhost:27017/EloEloElo';
  Mongoose.connect(connectionString);
  var db = Mongoose.connection;

  //db.on('error', console.error.bind(console, 'connection error:'));
  db.on('error', function(){
    Alerts.errorMessage('Database', 'Could not connect to database @ ' + connectionString);
  });
  db.once('open', function() {
    Alerts.systemMessage('Database', 'connecting...');
  });
};
