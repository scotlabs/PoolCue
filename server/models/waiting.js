'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Waiting Player Schema */
var waitingPlayer = Mongoose.Schema({
  player:   {type: String, required: true},
  time:     {type: Date, default: Date.now}
});

module.exports = Mongoose.model('Waiting', waitingPlayer);
