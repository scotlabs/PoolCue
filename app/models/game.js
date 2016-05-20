'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Game Schema */
var gameSchema = Mongoose.Schema({
  player1:    {type: String, required: true},
  player2:    {type: String, required: true},
  time:       {type: Date, default: Date.now},
  winner:     {type: String}
});

module.exports = Mongoose.model('Game', gameSchema);
