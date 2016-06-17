'use strict';

/* NPM Packages*/

/* Imports */
var Player     = require('../../models/player.js');
var Game       = require('../../models/game.js');
var Logger     = require('../../helpers/logger');
var Query      = require('../../helpers/query');
var GameHelper = require('../../helpers/game');

/* Global Variables */

/* Functions */

/* Add a game to the queue */
exports.queue = function(player1, player2, io) {
      player1 = GameHelper.formatName(player1);
      player2 = GameHelper.formatName(player2);
      if (player1.length >= 2 && player2.length >= 2 && player1 !== player2) {
        Logger.info('Queue ' + player1 + ' vs. ' + player2);

        var game = new Game();
        GameHelper.findOrCreatePlayer(game, player1, io);
        GameHelper.findOrCreatePlayer(game, player2, io);
      }else {
        Logger.warn('Error ' + player1 + ' vs. ' + player2);
      }
    };

/* Remove the game from the queue */
exports.abandon = function(gameId, io) {
      Game.findById(gameId, function(error, game) {
        if (error) {
          Logger.error('Problem fiding game: ' + gameId + ' to abandon: ' + error);
        }
        Logger.info('Abandon game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
        game.winner = 'Abandoned';
        game.save();

        GameHelper.removeInactivePlayer(game.player1, io);
        GameHelper.removeInactivePlayer(game.player2, io);
        Game.findById(gameId).remove().exec();

        Query.pushDataToSockets(io);
      });
    };

exports.updateAll = function(io) {
    Query.pushDataToSockets(io);
  };

/* Complete a game */
exports.complete = function(gameId, winner, io) {
    Game.findById(gameId, function(error, game) {
          if (error) {
            Logger.error('Problem finding game: ' + gameId + ', with the winner: ' + winner + ' to complete game: ' + error);
          }

          if (game.winner) {
            updateAll(io);
          }else {
            game.winner = winner;
            game.save();
            var loser = game.player2;
            if (game.player1 != winner) {
              loser = game.player1;
            }

            Player.find({name: {$in: [winner, loser]}}, function(error, players) {
                if (players[0].name == winner) {
                  GameHelper.updatePlayers(players[0], players[1], io);
                }else {
                  GameHelper.updatePlayers(players[1], players[0], io);
                }
              });
          }
        });
  };
