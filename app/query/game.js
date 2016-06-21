'use strict';

/* NPM Packages*/

/* Imports */
var Game  = require('../models/game');
var Query = require('../helpers/query');

/* Variables */

/* Functions */
exports.getAll = function(request, response) {
    Game.find({}, {__v: 0}).sort({time: 'descending'}).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.get = function(gameId, request, response) {
    Game.find({_id: request.params.id}, {__v: 0}).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.getByPlayer = function(playerName, request, response) {
    Game.find({$or: [{player1: playerName},
                    {player2: playerName}
                    ]
              },
              {__v: 0}).sort({time: 'descending'}).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.getByPlayers = function(player1Name, player2Name, request, response) {
    Game.find({$and: [{$or: [{player1: player1Name, player2: player2Name},
                             {player1: player2Name, player2: player1Name}]}]
              },
              {__v: 0}).sort({time: 'descending'}).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.getQueue = function(request, response) {
    Game.find({winner: null}, {__v: 0}).sort({time: 'ascending'}).limit(25).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.getPlaying = function(request, response) {
    Game.find({winner: null}, {__v: 0}).sort({time: 'ascending'}).limit(1).lean().exec(function(error, result) {
          response.json(result);
        });
  };

exports.getComplete = function(request, response) {
    Game.find({winner: {$ne: null }}, {__v: 0}).sort({time: 'descending'}).lean().exec(function(error, result) {
          response.json(result);
        });
  };
