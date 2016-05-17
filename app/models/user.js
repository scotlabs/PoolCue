'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Imports */

/* Global Variables */

/* Schema */
var userSchema = Mongoose.Schema({
  name:   {type: String, unique: true},
  elo:    {type: Number, default: 1000},
  wins:   {type: Number, default: 0},
  losses: {type: Number, default: 0},
});

module.exports = Mongoose.model('User', userSchema);
