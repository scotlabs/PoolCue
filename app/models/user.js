'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');

/* Imports */
var UserFunctions = require('../models/userFunctions.js');

/* Global Variables */

/* Schema */
var user = Mongoose.Schema({
  name:   {type: String, unique: true},
  elo:    {type: Number, default: 1000},
  wins:   {type: Number, default: 0},
  losses: {type: Number, default: 0},
});

user.methods.importStats = function(wins, losses) {
    UserFunctions.importStats(this, wins, losses);
  };

module.exports = Mongoose.model('User', user);
