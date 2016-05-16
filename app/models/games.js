'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
var Elo = require('elo-js');
var Alerts = require('../helpers/alerts');

/* Imports */
var User = require('../models/users.js');

/* Global Variables */
var elo = new Elo();

/* Schema */
var game = Mongoose.Schema({
  player1: {type: String, required: true},
  player1Elo: {type: Number},
  player2: {type: String, required: true},
  player2Elo: {type: Number},
  time: {type: Date, default: Date.now},
  winner: {type: String}
});

/* Functions */
game.methods.queue = function(queuePlayer1, queuePlayer2) {
  var game = this;
  User.findOne({name: queuePlayer1}, function(error, user1) {
      if (!user1) {
        user1 = new User({name: queuePlayer1}).save();
      }
      game.player1 = user1.name;
      game.player1Elo = user1.elo;
      game.save();
    });

  User.findOne({name: queuePlayer2}, function(error, user2) {
    if (!user2) {
      user2 = new User({name: queuePlayer2}).save();
    }
    game.player2 = user2.name;
    game.player2Elo = user2.elo;
    game.save();
  });

  return game;
};

game.methods.removeFromQueue = function() {
  this.remove().exec();

  return;
};

game.methods.abandon = function() {
  var player1 = User.findById(this.player1);
  var player2 = User.findById(this.player2);

  player1.elo = elo.ifTies(player1.elo, player2.elo);
  player2.elo = elo.ifTies(player2.elo, player1.elo);
  this.winner = 'Draw';
  this.save();

  return;
};

game.methods.complete = function(winner, loser) {
  var game = this;

  User.find({name: {$in: [winner, loser]}}, function(error, players) {
    if (players[0].name == winner) {
      completeGame(players[0], players[1]);
    }else {
      completeGame(players[1], players[0]);
    }

    game.winner = winner;
    game.save();
  });
};

function completeGame(winner, loser) {
  var winnerOldElo = winner.elo;
  var loserOldElo = loser.elo;

  Alerts.logMessage('Start', winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
  winner.elo = elo.ifWins(winner.elo, loser.elo);
  winner.wins++;
  winner.save();

  loser.elo = elo.ifLoses(loser.elo, winner.elo);
  loser.losses++;
  loser.save();

  Alerts.logMessage(' End ', 'Winner: ' + winner.name + ' (+' + (winner.elo - winnerOldElo) + ') & Loser:' + loser.name + '(' + (loser.elo - loserOldElo) + ')');
}

module.exports = Mongoose.model('Game', game);
