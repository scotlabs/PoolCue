'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../../models/player');
var Query = require('../../helpers/query');

/* Variables */

/* Routes */
module.exports = function(Router) {

    /* All players */
    Router.get('/api/players', function(request, response) {
        Query.find(Player, {}, {elo: 'descending'}, response);
      });

    /* Player by name */
    Router.get('/api/players/:name', function(request, response) {
        Query.find(Player, {name: request.params.name}, {}, response);
      });

    /* Incomplete endpoint for player stats */
    Router.get('/api/players/:name/stats', function(request, response) {
        Query.getStats(Player, request.params.name, {}, response);
        // Last 10 games
        // Longest win streak
        // Player most played
        // Player most wins
        // Player most losses
      });

  };
