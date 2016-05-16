'use strict';

/* NPM Packages*/

/* Imports */
var Server   = require('./app/server/serverConfig').start();
var Database = require('./app/server/databaseConfig').connect();
var User = require('./app/models/users');
var Game = require('./app/models/games');

/* Global Variables */

/* Functions */

// Test game
new Game().queue('testuser1', 'testuser2').complete('testuser1', 'testuser2');
//testGame.complete('testuser1', 'testuser2');
//new User({name: 'Jamie'}).importStats(32,42);
