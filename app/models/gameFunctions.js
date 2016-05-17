'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
var Elo      = require('elo-js');
var Alerts   = require('../helpers/alerts');

/* Imports */
var Player = require('../models/player.js');
var Game = require('../models/game.js');
var PlayerFunctions = require('../models/playerFunctions.js');

/* Global Variables */
var elo = new Elo();

/* Functions */
exports.queue = function(player1, player2) {
  var game = new Game();
  findOrCreatePlayer(player1, game);
  findOrCreatePlayer(player2, game);

  Alerts.logMessage('Queue', player1 + ' vs. ' + player2);
};

exports.abandon = function(gameId) {
    var game = this.findById(gameId);
    game.winner = 'Abandoned';
    Alerts.logMessage('Abandon', 'Game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
  };

exports.complete = function(gameId, winner, loser) {

  var game = this.findById(gameId);
  Player.find({name: {$in: [winner, loser]}}, function(error, players) {
    if (players[0].name == winner) {
      updatePlayers(players[0], players[1]);
    }else {
      updatePlayers(players[1], players[0]);
    }

    game.winner = winner;
    game.save();
  });
};

exports.findById = function(gameID) {
  Game.findById(gameID, function(error, game) {
      return game;
    });
};

function findOrCreatePlayer(playerName, game) {
  Player.findOne({name: playerName}, function(error, player) {
    if (!player) {
      player = new Player({name: playerName}).save();
      Alerts.logMessage('Create', 'New player created: ' +  playerName);
    }

    if (!game.player1) {
      game.player1 = player.name;
      game.player1Elo = player.elo;
    }else {
      game.player2 = player.name;
      game.player2Elo = player.elo;
    }
    game.save();
  });
}

function updatePlayers(winner, loser) {
  Alerts.logMessage('Start', winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
  winner.elo = elo.ifWins(winner.elo, loser.elo);
  winner.wins++;
  winner.save();

  loser.elo = elo.ifLoses(loser.elo, winner.elo);
  loser.losses++;
  loser.save();
  Alerts.logMessage(' End ', winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
};
