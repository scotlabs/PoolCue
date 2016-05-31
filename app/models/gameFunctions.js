'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
var Elo      = require('elo-js');
var Alerts   = require('../helpers/alerts');

/* Imports */
var Player = require('../models/player.js');
var Game = require('../models/game.js');

/* Global Variables */
var EloRanking = new Elo();

/* Functions */

/* Add a game to the queue */
exports.queue = function(request, response) {
      Alerts.logMessage('Queue', request.body.player1 + ' vs. ' + request.body.player2);
      findOrCreatePlayer(request.body.player1, request.body.player2, response);
    };

/* Remove the game from the queue */
exports.abandon = function(request, response, next) {
    Game.findById(request, function(error, game) {
        game.winner = 'Abandoned';
        game.save();
        Alerts.logMessage('Abandon', 'Game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
        response.redirect('/queue');
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
      player1 = new Player({name: player1Name});
      player1.save();
      Alerts.logMessage('Create', 'New player created: ' +  player1.name);
    }
    game.player1 = player1.name;
    game.save();
  });

  Player.findOne({name: player2Name}, function(error, player2) {
    if (!player2) {
      player2 = new Player({name: player2Name});
      player2.save();
      Alerts.logMessage('Create', 'New player created: ' +  player2.name);
    }
    game.player2 = player2.name;
    game.save();
    response.redirect('/queue');
  });

}

/* Update helper function for game complete */
function updatePlayers(winner, loser) {
  Alerts.logMessage('Start', winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
  winner.elo = EloRanking.ifWins(winner.elo, loser.elo);
  winner.wins++;
  winner.save();

  loser.elo = EloRanking.ifLoses(loser.elo, winner.elo);
  loser.losses++;
  loser.save();
  Alerts.logMessage(' End ', winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
};
