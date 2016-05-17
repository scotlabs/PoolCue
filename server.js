'use strict';

/* NPM Packages*/

/* Imports */
var Server   = require('./app/server/serverConfig').start();
var Database = require('./app/server/databaseConfig').connect();
var User = require('./app/models/user');
var UserFunctions = require('./app/models/userFunctions');
var Game = require('./app/models/game');

/* Global Variables */

/* Functions */

// Test game
var game = new Game().queue('testuser1', 'testuser2').complete('testuser1', 'testuser2');
//testGame.complete('testuser1', 'testuser2');
var user = new User({name: 'Jamie'}).importStats(32,42);
//UserFunctions.importStats(32,42);
