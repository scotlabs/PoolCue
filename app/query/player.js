'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../models/player');
var Query  = require('../helpers/query');

/* Variables */

/* Functions */
exports.getAll = function(request, response) {
    Query.find(Player, {}, {elo: 'descending'}, request, response);
  };

exports.get = function(playerName, request, response) {
    Query.find(Player, {name: playerName}, {}, request, response);
  };

exports.getStats = function(playerName, request, response) {
    Query.getStats(Player, request.params.name, {}, request, response);
    // Last 10 games. (WLLLWWWLWW)
    // Longest win streak.
    // Player most played. (Wins - Losses)
    // Nemisis
    // Tournament wins.
    // Tournament entries.
    // Tournament best round.
  };
