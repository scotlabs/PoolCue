'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../models/player');
var Query = require('../helpers/query');

/* Variables */

/* Functions */
exports.getAll = function(request, response, next) {
    Query.find(Player, {}, {elo: 'descending'}, request, response, next);
  };

exports.get = function(playerName, request, response, next) {
    Query.find(Player, {name: playerName}, {}, request, response, next);
  };

exports.getStats = function(playerName, request, response, next) {
    Query.getStats(Player, request.params.name, {}, request, response, next);
    // Last 10 games
    // Longest win streak
    // Player most played
    // Player most wins
    // Player most losses
  };
