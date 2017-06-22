'use strict';

/* NPM Packages*/

/* Imports */
const Player = require('../models/player');
const PlayerMethods = require('../models/methods/player');

/* Functions */
exports.getAll = function(request, response) {
    Player.find({}).sort({ elo: 'descending' }).lean().exec(function(error, result) {
        response.json(result);
    });
};

exports.get = function(playerName, request, response) {
    Player.find({ name: playerName }).lean().exec(function(error, result) {
        response.json(result);
    });
};

exports.getStats = function(playerName, request, response) {
    PlayerMethods.getStats(playerName, null, request, response);
};