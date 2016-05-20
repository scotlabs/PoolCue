'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../../models/game');

/* Variables */

/* Functions */
exports.find = function(collection, query, sort, response) {
    collection.find({$and: [query]}, {_id: 0, __v: 0}).lean().exec(function(error, result) {
        response.json(result);
      });
  };

exports.getStats = function(collection, playerName, sort, response) {
    // Last 10 games
    // Longest win streak
    // Player most played
    // Player most wins
    // Player most losses
  };
