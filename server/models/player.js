'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
var Elo = require('elo-js');
var EloRanking = new Elo();

/* Player Schema */
var player = Mongoose.Schema({
  name:               {type: String, unique: true},
  elo:                {type: Number, default: 1000},
  wins:               {type: Number, default: 0},
  losses:             {type: Number, default: 0},
  liberated:          {type: Boolean},
}, {timestamps: true});

player.methods.wonGame = function wonGame(loserElo){
  this.elo = EloRanking.ifWins(this.elo, loserElo);
  this.wins++;
  this.save();
};

player.methods.lostGame = function lostGame(winnerElo){
  this.elo = EloRanking.ifLoses(this.elo, winnerElo);
  this.losses++;
  this.save();
}

module.exports = Mongoose.model('Player', player);