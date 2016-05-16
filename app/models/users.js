'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
var Elo = require('elo-js');

/* Imports */
var elo = new Elo();

/* Global Variables */

/* Schema */
var user = Mongoose.Schema({
  name:   {type: String, unique: true},
  elo:    {type: Number, default: 1000},
  wins:   {type: Number, default: 0},
  losses: {type: Number, default: 0},
});

/* Functions */
user.methods.importStats = function(wins, losses) {

  console.log('Importing scores for ' + this.name);
  console.log('Wins ' + wins + '  - ' + losses + ' Losses');

  for (var j = 0; j < losses; j++) {
    var oldEloLosses = this.elo;
    this.elo = elo.ifLoses(this.elo, 1000);

    console.log('Loss -' + (oldEloLosses - this.elo) + '.   -- rank:' + this.elo);
  }
  for (var i = 0; i < wins; i++) {
    var oldEloWins = this.elo;
    this.elo = elo.ifWins(this.elo, 1000);

    console.log('Win  +' + (this.elo - oldEloWins) + '.   -- rank:' + this.elo);
  }
  this.wins = wins;
  this.losses = losses;

  this.save();
};

module.exports = Mongoose.model('User', user);
