'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Player Schema */
var player = Mongoose.Schema({
  name:               {type: String, unique: true},
  elo:                {type: Number, default: 1000},
  wins:               {type: Number, default: 0},
  losses:             {type: Number, default: 0},
  liberated:          {type: Boolean},
});

module.exports = Mongoose.model('Player', player);
