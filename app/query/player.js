'use strict';

/* NPM Packages*/

/* Imports */
var Player        = require('../models/player');
var PlayerMethods = require('../models/methods/player');

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
    PlayerMethods.getStats(playerName, request, response);
  };
