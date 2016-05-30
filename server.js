'use strict';

/* NPM Packages*/

/* Imports */
var Server   = require('./app/server/serverConfig').start(__dirname);
var Database = require('./app/server/databaseConfig').connect();

/* Global Variables */

/* Functions */

// Test import
//var Player = require('./app/models/playerFunctions');
//Player.importPlayer('Jamie', 10, 10);
