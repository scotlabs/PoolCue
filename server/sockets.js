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
		Logger.debug('---------------------------------------------');
		Logger.debug('New socket connection');
		Logger.debug(io.sockets.server.eio.clientsCount + ' total connections');
		Logger.debug('---------------------------------------------');

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
			WaitingList.add(playerName, io);
		});

		socket.on('remove waitinglist', function (playerName) {
			WaitingList.remove(playerName, io);
		});

		socket.on('create game fromwaiting', function (player1, player2) {
			Game.queue(player1, player2, io);
			WaitingList.remove(player1, io);
			WaitingList.remove(player2, io);
		});

		socket.on('play winner', function (playerName, gameId) {
			Game.playWinner(playerName, gameId, io);
		});

    socket.on('player update', function(playerName, mobileNumber, enableNotification){
      Player.updateMobile(playerName, mobileNumber, enableNotification);
    });
    
	});
};
