'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../models/game');
var Query = require('../helpers/query');

/* Variables */

/* Functions */
exports.getAll = function(request, response) {
    Query.find(Game, {}, {time: 'descending'}, request, response);
  };

exports.get = function(gameId, request, response) {
    Query.find(Game, {_id: request.params.id}, {}, request, response);
  };

exports.getByPlayer = function(playerName, request, response) {
    Query.find(Game,
                {$or:
                    [{player1: playerName},
                    {player2: playerName}]
                },
                {time: 'descending'},
                request,
                response);
  };

exports.getByPlayers = function(player1Name, player2Name, request, response) {
    Query.find(Game,
                {$or:
                    [{player1: player1Name, player2: player2Name},
                    {player1: player2Name, player2: player1Name}]
                },
                {time: 'descending'},
                request,
                response);
  };

exports.getQueue = function(request, response) {
    Query.find(Game, {winner: null}, {time: 'ascending'}, request, response);
  };
