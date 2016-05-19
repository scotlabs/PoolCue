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

exports.getStats = function(collection, playerName, response) {
    console.log(playerName);
    // 10 last games
    var lastTen = [];
    Game.find({$and:
                [{$or:
                    [{player1: playerName},
                    {player2: playerName}]}]},
                {_id: 0, __v: 0}).sort({time: 'descending'}).limit(10).lean().exec(function(error, result) {

        for (var i = 0; i < result.length; i++) {
          if (result[i].winner === playerName) {
            lastTen.push('win');
          }else if (result[i].winner) {
            lastTen.push('loss');
          }

        }

        //response.json(lastTen);
      });

    //Higest Elo
    Game.find({$and:
                [{$or:
                    [{player1: playerName},
                    {player2: playerName}]}]},
                {_id: 0, __v: 0}).lean().exec(function(error, result) {

        for (var i = 0; i < result.length; i++) {
          var highestElo = 0;
          console.log(result[i].player1);
          console.log(playerName);
          if (result[i].player1 === playerName) {
            if (result[i].player1Elo > highestElo) {
              highestElo = result[i].player1Elo;
            }
          }else {
            if (result[i].player2Elo > highestElo) {
              highestElo = result[i].player2Elo;
            }
          }
        }
        response.json(highestElo);
      });
  };
