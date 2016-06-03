'use strict';

/* NPM Packages*/

/* Imports */
var Logger = require('../helpers/logger');
var Game = require('../models/gameFunctions');

/* Global Variables */

/* Functions */
exports.connect = function(server) {
    var io = require('socket.io').listen(server);
    Logger.info('Starting sockets.');
    io.on('connection', function(socket) {
        Logger.debug('New socket connection.');

        socket.on('create game', function(player1, player2) {
          Game.queue2(player1, player2, io);
        });

        socket.on('update leaderboard', function(player1, player2) {
          Game.getLeaderboard(io);
        });

      });
  };
