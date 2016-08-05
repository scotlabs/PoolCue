'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Imports */
var Logger = require('./helpers/logger');

/* Global Variables */

/* Functions */
exports.connect = function() {
  var connectionString ="";
  
  if (process.env.NODE_ENV !== 'production') {
      connectionString = 'mongodb://localhost:27017/EloEloElo';
    }else {
      connectionString = process.env.DBConnectionString;
    }
  
  Logger.info("Connecting to Database: " + connectionString);
  
  Mongoose.connect(connectionString);

  Mongoose.connection.on('error', function() {
    Logger.error('Could not connect to database @ ' + connectionString);
  });

  Mongoose.connection.once('open', function() {
    Logger.info('Connected to database @ ' + connectionString);
  });
};
