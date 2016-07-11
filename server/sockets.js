'use strict';

/* NPM Packages*/

/* Imports */
var Logger = require('./helpers/logger');
var Game = require('./models/methods/game');
var Player = require('./models/methods/player');
var WaitingList = require('./models/methods/waiting');

/* Global Variables */

/* Functions */
exports.connect = function (server) {
  var io = require('socket.io').listen(server);
  Logger.info('Starting sockets.');
  io.on('connection', function (socket) {
    Logger.debug('New socket connection');

    socket.on('create game', function (player1, player2) {
      Game.queue(player1, player2, io);
    });

    socket.on('delete game', function (gameId) {
      Game.abandon(gameId, io);
    });

    socket.on('complete game', function (gameId, winner) {
      Game.complete(gameId, winner, io);
    });

    socket.on('update all', function () {
      Game.updateAll(socket);
    });

    socket.on('player stats', function (playerName) {
      Player.getStats(playerName, socket);
    });

    socket.on('addto waitinglist', function (playerName) {
      WaitingList.add(playerName, socket);
    });

    socket.on('create game fromwaiting', function (player1, player2) {
      Game.queue(player1, player2, io);
      WaitingList.remove(player1, socket);
      WaitingList.remove(player2, socket);
    });


  });
};
