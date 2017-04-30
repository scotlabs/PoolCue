'use strict';

/* Imports */
var Game = require('../../../query/game');
var GameHelper = require('../../../helpers/game');

/* Routes */
module.exports = function (Router) {
	var root = '/api/v1/games/'

	// Endpoint: All Games
	// Example: GET - example.com/api/games
	Router.get(root, function (request, response) {
		Game.getAll(request, response);
	});

	// Endpoint: All Games currently in the Queue
	// Example: GET - example.com/api/games/queue
	Router.get(root + 'queue', function (request, response) {
		console.log('here')
		Game.getQueue(request, response);
	});

	// Endpoint: The Game currently being played
	// Example: GET - example.com/api/games/current
	Router.get(root + 'current', function (request, response) {
		Game.getPlaying(request, response);
	});

	// Endpoint: All Games that are complete
	// Example: GET - example.com/api/games/complete
	Router.get(root + 'complete', function (request, response) {
		Game.getComplete(request, response);
	});

	// Endpoint: A game by Id.
	// Example: GET - example.com/api/games/id/183c519f7b99fceab00820570
	Router.get(root + 'id/:id', function (request, response) {
		Game.get(request.params.id, request, response);
	});

	// Endpoint: A player by name or find player with an specific opponent
	// Example: GET - example.com/api/games/player/Fred
	// Example: GET - example.com/api/games/player/Fred?opponent=George
	Router.get(root + 'player/:name', function (request, response) {
		var playerName = GameHelper.formatName(request.params.name);
		if (request.query.opponent) {
			var opponentName = GameHelper.formatName(request.query.opponent);
			Game.getByPlayers(playerName, opponentName, request, response);
		} else {
			Game.getByPlayer(playerName, request, response);
		}
	});

};
