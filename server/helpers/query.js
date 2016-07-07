'use strict';

/* NPM Packages*/

/* Imports */
var Games   = require('../models/game');
var Players = require('../models/player');

/* Variables */

/* Functions */
exports.pushDataToSockets = function(io) {
  Games.find({winner: null}, {__v: 0}).sort({time: 'ascending'}).limit(25).lean().exec(function(error, games) {
    Players.find({}, {__v: 0}).sort({elo: 'descending'}).lean().exec(function(error, players) {
      io.emit('update data', {
        players: players,
        games: games
      });
    });
  });
};
