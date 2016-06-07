'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../models/game');
var Query = require('../helpers/query');

/* Variables */

/* Functions */
exports.getAll = function(request, response, next) {
    Query.find(Game, {}, {time: 'descending'}, request, response, next);
  };

exports.get = function(gameId, request, response, next) {
    Query.find(Game, {_id: request.params.id}, {}, request, response, next);
  };

exports.getByPlayer = function(playerName, request, response, next) {
    Query.find(Game,
                {$or:
                    [{player1: playerName},
                    {player2: playerName}]
                },
                {time: 'descending'},
                request,
                response,
                next);
  };

exports.getByPlayers = function(player1Name, player2Name, request, response, next) {
    Query.find(Game,
                {$or:
                    [{player1: player1Name, player2: player2Name},
                    {player1: player2Name, player2: player1Name}]
                },
                {time: 'descending'},
                request,
                response,
                next);
  };

exports.getQueue = function(request, response, next) {
    Query.find(Game, {winner: null}, {time: 'ascending'}, request, response, next);
  };
