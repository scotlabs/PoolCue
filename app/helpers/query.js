'use strict';

/* NPM Packages*/

/* Imports */
var Games = require('../models/game.js');
var Players = require('../models/player.js');

/* Variables */

/* Functions */

/* Nonone wants to write find raw find functions */
exports.find = function(collection, query, sort, request, response, next) {
    collection.find({$and: [query]}, {__v: 0}).sort(sort).lean().exec(function(error, result) {
        if (next) {
          request.result = result;
          next();
        }else {
          response.json(result);
        }
      });
  };

exports.pushDataToSockets = function(io) {
  Games.find({winner: null}, {__v: 0}).sort({time: 'ascending'}).lean().exec(function(error, games) {
    Players.find({}, {__v: 0}).sort({elo: 'descending'}).lean().exec(function(error, players) {
      io.emit('update data', {
        players: players,
        games: games
      });
    });
  });
};

exports.getStats = function(collection, playerName, sort, response) {
    // Last 10 games
    // Longest win streak
    // Player most played
    // Player most wins
    // Player most losses
  };
