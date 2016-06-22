'use strict';

/* NPM Packages*/

/* Imports */
var Games   = require('../models/game.js');
var Players = require('../models/player.js');

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
