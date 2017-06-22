'use strict';

/* Imports */
var Player = require('../../../query/player');
var GameHelper = require('../../../helpers/game');

/* Routes */
module.exports = function(Router) {
    var root = '/api/v1/players/';

    // Endpoint: All Players
    // Example: GET - example.com/api/players
    Router.get(root, function(request, response) {
        Player.getAll(request, response);
    });

    // Endpoint: A Player by Name
    // Example: GET - example.com/api/players/Fred
    Router.get(root + ':name', function(request, response) {
        var playerName = GameHelper.formatName(request.params.name);
        Player.get(playerName, request, response);
    });

    // Endpoint: A Players Stats by Name
    // Example: GET - example.com/api/players/Fred/stats
    Router.get(root + ':name/stats', function(request, response) {
        var playerName = GameHelper.formatName(request.params.name);
        Player.getStats(playerName, request, response);
    });

};