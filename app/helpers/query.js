'use strict';

/* NPM Packages*/

/* Imports */

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

exports.getStats = function(collection, playerName, sort, response) {
    // Last 10 games
    // Longest win streak
    // Player most played
    // Player most wins
    // Player most losses
  };
