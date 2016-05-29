'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../../models/playerQuery');

/* Variables */

/* Routes */
module.exports = function(Router) {

    /* All players */
    Router.get('/api/players', function(request, response) {
        Player.getAll(request, response);
      });

    /* Player by name */
    Router.get('/api/players/:name', function(request, response) {
        Player.get(request.params.name, request, response);
      });

    /* Incomplete endpoint for player stats */
    Router.get('/api/players/:name/stats', function(request, response) {
        Player.getStats(request.params.name, request, response);
        // Last 10 games
        // Longest win streak
        // Player most played
        // Player most wins
        // Player most losses
        // Nemisis
      });

  };
