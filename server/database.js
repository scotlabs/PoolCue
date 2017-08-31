'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;

/* Imports */
var Config = require('../config.js');
var Logger = require('./helpers/logger');

/* Global Variables */

/* Functions */
exports.connect = function() {
    // var connectionString = 'mongodb://' + Config.database_username + ':' + Config.database_password + '@' + Config.database_host + ':' + Config.database_port + '/' + Config.database_name;

    const uri = "mongodb://" + Config.database_host  + ":" + Config.database_port + "/" + Config.database_name;
    const options = {
        server: {
            poolSize: 5,
            auto_reconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000
        },
        user: Config.database_username,
        pass: Config.database_password,
    };

    Logger.info("Connecting to Database: " + uri);

    Mongoose.connect(uri, options);
    // Mongoose.openUri(connectionString);

    Mongoose.connection.on('error', function(error) {
        Logger.error('Could not connect to database @ ' + uri);
        Logger.error(error);
    });

    Mongoose.connection.on('reconnected', function() {
        Logger.info('MongoDB reconnected!');
    });

    Mongoose.connection.on('disconnected', function() {
        Logger.error('MongoDB disconnected!');
    });

    Mongoose.connection.once('open', function() {
        Logger.info('Connected to database @ ' + uri);
    });
}