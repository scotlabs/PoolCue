'use strict';

/* Imports */
var Game = require('../../models/methods/game');

/* Routes */
module.exports = function (Router, io) {

	Router.post('/games/create', function (request, response) {
		Game.queue(request.query.player1, request.query.player2, io);
	});

	Router.post('/games/delete', function (request, response) {
		Game.queue(request.query.gameId, io);
	});

	Router.post('/games/complete', function (request, response) {
		Game.complete(request.query.gameId, request.query.winner, io);
	});
};
