'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../../query/game');

/* Variables */

/* Routes */
module.exports = function(Router) {

    /* All games */
    Router.get('/api/games', function(request, response) {
        Game.getAll(request, response);
      });

    /* Game by ID */
    Router.get('/api/games/id/:id', function(request, response) {
        Game.get(request.params.id, request, response);
      });

    /* Games by player name */
    Router.get('/api/games/player/:name', function(request, response) {
        Game.getByPlayer(request.params.name, request, response);
      });

    /* Find player by name - with the option for opponents as a param ie. ?opponent= */
    Router.get('/api/games/players/:name', function(request, response) {
        Game.getByPlayers(request.params.name, request.query.opponent, request, response);
      });

  };
