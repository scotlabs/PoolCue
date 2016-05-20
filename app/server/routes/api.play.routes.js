'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../../models/gameFunctions');

/* Variables */

/* Routes */
module.exports = function(Router) {

    /* Create a new game with params ie. /api/games/create?player1=Jamie&player2=NotJamie */
    Router.get('/api/games/create', function(request, response) {
        if (request.query.player1 && request.query.player2) {
          Game.queue(request.query.player1, request.query.player2, response);
        }else {
          response.json('Bad Format');
        }
      });

    /* Abandon game by ID. */
    Router.get('/api/games/abandon/:id', function(request, response) {
        Game.abandon(request.params.id, response);
      });

    /* Complete a game. */
    Router.get('/api/games/complete/:id/:winner', function(request, response) {
        Game.complete(request.params.id, request.params.winner, response);
      });

  };
