'use strict';

/* NPM Packages*/

/* Imports */
var Game = require('../models/game');

/* Variables */

/* Functions */
exports.getAll = function(request, response) {
    search(response, null, { time: 'descending' }, null);
};

exports.get = function(gameId, request, response) {
    search(response, { _id: request.params.id }, null, null);
};

exports.getByPlayer = function(playerName, request, response) {
    var searchParams = { $or: [{ player1: playerName }, { player2: playerName }] };
    search(response, searchParams, { time: 'descending' }, null);
};

exports.getByPlayers = function(player1Name, player2Name, request, response) {
    var searchParams = { $and: [{ $or: [{ player1: player1Name, player2: player2Name }, { player1: player2Name, player2: player1Name }] }] };
    search(response, searchParams, { time: 'descending' }, null);
};

exports.getQueue = function(request, response) {
    search(response, { winner: null }, { time: 'ascending' }, 25);
};

exports.getPlaying = function(request, response) {
    search(response, { winner: null }, { time: 'ascending' }, 1);
};

exports.getComplete = function(request, response) {
    search(response, { winner: { $ne: null } }, { time: 'descending' }, null);
};

function search(response, searchParams, sort, limit) {
    Game.find(searchParams, { __v: 0 }).sort(sort).limit(limit).lean().exec(function(error, result) {
        response.json(result);
    });
}