'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Schema */
var playerSchema = Mongoose.Schema({
  name:   {type: String, unique: true},
  elo:    {type: Number, default: 1000},
  wins:   {type: Number, default: 0},
  losses: {type: Number, default: 0},
});

module.exports = Mongoose.model('Player', playerSchema);
