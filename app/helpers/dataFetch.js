'use strict';

/* NPM Packages*/

/* Imports */

/* Global Variables */

/* Functions */

exports.findData = function(collection, res){
  collection.find().limit(1000).lean().exec(function(err, data) {
          res.json(sanitiseData(data));
      });
};

exports.findData = function(collection, query, res){
  collection.find({$and: [query]}).limit(1000).lean().exec(function(err, data) {
          res.json(sanitiseData(data));
      });
};

function sanitiseData(object){
  for (var i = 0; i < object.length; i++) {
    delete object._id;
    delete object.__v;
  }
}
