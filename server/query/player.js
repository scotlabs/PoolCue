'use strict';

/* NPM Packages*/

/* Imports */
const Player        = require('../models/player');
const PlayerMethods = require('../models/methods/player');

/* Variables */
const filter = {__v: 0, mobile_number: 0, enableNotification: 0};

/* Functions */
exports.getAll = function(request, response) {
    Player.find({}, filter).sort({elo: 'descending'}).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.get = function(playerName, request, response) {
    Player.find({name: playerName}, filter).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.getStats = function(playerName, request, response) {
    PlayerMethods.getStats(playerName, null, request, response);
  };
