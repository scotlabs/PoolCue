'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../../query/game');
var GameHelper = require('../../helpers/game');

/* Variables */

/* Routes */
module.exports = function (Router) {
	var root = '/api/games/'

	/* All games */
	Router.get(root, function (request, response) {
		Game.getAll(request, response);
	});

	/* Games in the queue */
	Router.get(root + 'queue', function (request, response) {
		Game.getQueue(request, response);
	});

	/* Games currently playing */
	Router.get(root + 'current', function (request, response) {
		Game.getPlaying(request, response);
	});

	/* Games that are complete */
	Router.get(root + 'complete', function (request, response) {
		Game.getComplete(request, response);
	});

	/* Game by ID */
	Router.get(root + 'id/:id', function (request, response) {
		Game.get(request.params.id, request, response);
	});

	/* Find games by player name - with the option for opponents as a param ie. ?opponent= */
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
