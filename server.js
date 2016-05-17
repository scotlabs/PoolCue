'use strict';

/* NPM Packages*/

/* Imports */
var Server   = require('./app/server/serverConfig').start();
var Database = require('./app/server/databaseConfig').connect();
var Player = require('./app/models/playerFunctions');
var Game = require('./app/models/gameFunctions');

/* Global Variables */

/* Functions */

// Test game
//var game = Game.queue('testuser1', 'testuser2').complete('testuser1', 'testuser2');
//testGame.complete('testuser1', 'testuser2');
Player.importPlayer('Jamie', 10, 10);
var game = Game.queue('test1', 'test2');
//Game.complete('test1', 'test2');
//Game.findById('573b674ad255b6d24033bc1f');
//game.complete('test1', 'test2');
//UserFunctions.importStats(32,42);
