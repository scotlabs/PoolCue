'use strict';

/* NPM Packages*/

/* Imports */

/* Variables */

/* Functions */
exports.find = function(collection, query, response) {
    collection.find({$and: [query]}, {_id: 0, __v: 0}).lean().exec(function(error, result) {
        response.json(result);
      });
  };

exports.findOr = function(collection, query, response) {
    collection.find({$or: [query]}, {_id: 0, __v: 0}).lean().exec(function(error, result) {
        response.json(result);
      });
  };
