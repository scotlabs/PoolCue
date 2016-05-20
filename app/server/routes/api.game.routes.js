'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../../models/game');
var Query = require('../../helpers/query');

/* Variables */

/* Routes */
module.exports = function(Router) {

    /* All games */
    Router.get('/api/games', function(request, response) {
        Query.find(Game, {}, {time: 'descending'}, response);
      });

    /* Game by ID */
    Router.get('/api/games/id/:id', function(request, response) {
        Query.find(Game, {_id: request.params.id}, {}, response);
      });

    /* Games by player name */
    Router.get('/api/games/player/:name', function(request, response) {
        Query.find(Game,
                    {$or:
                        [{player1: request.params.name},
                        {player2: request.params.name}]
                    },
                    {},
                    response);
      });

    /* Find player by name - with the option for opponents as a param ie. ?opponent= */
    Router.get('/api/games/player/:name', function(request, response) {
        Query.find(Game,
                    {$or:
                        [{player1: request.params.name, player2: request.query.opponent},
                        {player1: request.query.opponent, player2: request.params.name}]
                    },
                    {},
                    response);
      });

  };
