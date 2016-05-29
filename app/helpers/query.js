'use strict';

/* NPM Packages*/

/* Imports */

/* Variables */

/* Functions */

/* Nonone wants to write find raw find functions */
exports.find = function(collection, query, sort, response) {
    collection.find({$and: [query]}, {_id: 0, __v: 0}).sort(sort).lean().exec(function(error, result) {
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
