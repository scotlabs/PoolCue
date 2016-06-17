'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../models/player');
var Query  = require('../helpers/query');

/* Variables */

/* Functions */
exports.getAll = function(request, response) {
    Player.find({}, {__v: 0}).sort({elo: 'descending'}).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.get = function(playerName, request, response) {
    Player.find({name: playerName}, {__v: 0}).lean().exec(function(error, result) {
          response.json(result);
        });
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
