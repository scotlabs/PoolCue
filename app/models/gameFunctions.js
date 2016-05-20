'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
var Elo      = require('elo-js');
var Alerts   = require('../helpers/alerts');

/* Imports */
var Player = require('../models/player.js');
var Game = require('../models/game.js');

/* Global Variables */
var elo = new Elo();

/* Functions */

/* Add a game to the queue */
exports.queue = function(player1, player2, response) {
    findOrCreatePlayer(player1, player2, response);
    Alerts.logMessage('Queue', player1 + ' vs. ' + player2);
  };

/* Remove the game from the queue */
exports.abandon = function(gameId, response) {
    Game.findById(gameId, function(error, game) {
        game.winner = 'Abandoned';
        game.save();
        response.redirect('/api/games/id/' + game._id);
        Alerts.logMessage('Abandon', 'Game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
      });
  };

/* Complete a game */
exports.complete = function(gameId, winner, response) {
    Game.findById(gameId, function(error, game) {
          game.winner = winner;
          game.save();
          var loser = game.player2;
          if (game.player1 != winner) {
            loser = game.player1;
          }

          Player.find({name: {$in: [winner, loser]}}, function(error, players) {
              if (players[0].name == winner) {
                updatePlayers(players[0], players[1]);
              }else {
                updatePlayers(players[1], players[0]);
              }
            });
        });
    response.redirect('/api/games/id/' + game._id);
  };

/* Create helper function for game queue */
function findOrCreatePlayer(player1Name, player2Name, response) {
  var game = new Game();
  Player.findOne({name: player1Name}, function(error, player1) {
    if (!player1) {
      player1 = new Player({name: player1});
      player1.save();
      Alerts.logMessage('Create', 'New player created: ' +  player1);
    }
    game.player1 = player1.name;
    game.save();

    Player.findOne({name: player2Name}, function(error, player2) {
      if (!player2) {
        player2 = new Player({name: player2});
        player2.save();
        Alerts.logMessage('Create', 'New player created: ' +  player2);
      }
      game.player2 = player2.name;
      response.redirect('/api/games/id/' + game._id);
      game.save();
    });
  });
}

/* Update helper function for game complete */
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
