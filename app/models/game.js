'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Imports */

/* Global Variables */

/* Schema */
var game = Mongoose.Schema({
  player1:    {type: String, required: true},
  player1Elo: {type: Number},
  player2:    {type: String, required: true},
  player2Elo: {type: Number},
  time:       {type: Date, default: Date.now},
  winner:     {type: String}
});

module.exports = Mongoose.model('Game', game);
