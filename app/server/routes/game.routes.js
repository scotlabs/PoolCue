'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../../models/game');
var Query = require('../routes/query');

/* Variables */

/* Routes */
module.exports = function(Router) {

    /* All games */
    Router.get('/api/games', function(request, response) {
        Query.find(Game, {}, response);
      });

    /* Games by player name */
    Router.get('/api/games/:name', function(request, response) {
        Query.find(Game,
                    {$or:
                        [{player1: request.params.name},
                        {player2: request.params.name}]},
                    response);
      });

    Router.get('/api/games/:name', function(request, response) {
        Query.find(Game,
                   {$or:
                        [{player1: request.params.name, player2: request.query.opponent},
                        {player1: request.query.opponent, player2: request.params.name}]},
                    response);
      });

  };
