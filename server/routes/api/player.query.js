'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../../query/player');
var GameHelper = require('../../helpers/game');

/* Variables */

/* Routes */
module.exports = function (Router) {
	var root = '/api/players/';

	/* All players */
	Router.get(root, function (request, response) {
		Player.getAll(request, response);
	});

	/* Player by name */
	Router.get(root + ':name', function (request, response) {
		var playerName = GameHelper.formatName(request.params.name);
		Player.get(playerName, request, response);
	});

	/* Player stats */
	Router.get(root + ':name/stats', function (request, response) {
		var playerName = GameHelper.formatName(request.params.name);
		Player.getStats(playerName, request, response);
	});

};
