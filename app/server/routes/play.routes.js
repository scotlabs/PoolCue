'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../../models/gameFunctions');

/* Variables */

/* Routes */
module.exports = function(Router) {

    /* All players */
    Router.get('/api/games/create', function(request, response) {
        if (request.query.player1 && request.query.player2) {
          Game.queue(request.query.player1, request.query.player2, response);
        }else {
          response.json('Bad Format');
        }
      });

    /* Player by name */
    Router.get('/api/games/delete/:id', function(request, response) {
        Game.abandon(request.params.id, response);
        //Query.find(Player, {name: request.params.name}, {}, response);
      });

    Router.get('/api/games/complete/:id/:winner', function(request, response) {
        Game.complete(request.params.id, request.params.winner, response);
        // Last 10 games
        // Longest win streak
        // Player most played
        // Player most wins
        // Player most losses
      });

  };
