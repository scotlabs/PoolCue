'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Imports */
var Config = require('../config.js');
var Logger = require('./helpers/logger');

/* Global Variables */

/* Functions */
exports.connect = function() {
    var connectionString = 'mongodb://' + Config.database_username + ':' + Config.database_password + '@' + Config.database_host + ':' + Config.database_port + '/' + Config.database_name;

    Logger.info("Connecting to Database: " + connectionString);

    Mongoose.connect(connectionString);

    Mongoose.connection.on('error', function(error) {
        Logger.error('Could not connect to database @ ' + connectionString);
        Logger.error(error);
    });

    Mongoose.connection.on('reconnected', function() {
        Logger.info('MongoDB reconnected!');
    });

    Mongoose.connection.on('disconnected', function() {
        Logger.error('MongoDB disconnected!');
        Mongoose.connect(connectionString, { server: { auto_reconnect: true } });
    });

    Mongoose.connection.once('open', function() {
        Logger.info('Connected to database @ ' + connectionString);
    });
}