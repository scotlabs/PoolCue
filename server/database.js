'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Imports */
var Logger = require('./helpers/logger');
var util = require('util');

/* Global Variables */

/* Functions */
exports.connect = function () {
	var connectionString = '';

	if (process.env.NODE_ENV == 'production') {
		if (process.env.DBConnectionString) {
			connectionString = process.env.DBConnectionString;
		} else {
			connectionString = util.format('mongodb://mongo-node:%s/EloEloElo', process.env.MONGO_PORT);
		}
	} else {
		connectionString = 'mongodb://192.168.99.100:27017/EloEloElo';
	}


	Logger.info("Connecting to Database: " + connectionString);

	Mongoose.connect(connectionString);

	Mongoose.connection.on('error', function () {
		Logger.error('Could not connect to database @ ' + connectionString);
	});

	Mongoose.connection.once('open', function () {
		Logger.info('Connected to database @ ' + connectionString);
	});
};
