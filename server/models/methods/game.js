'use strict';

/* NPM Packages*/

/* Imports */
var Player     = require('../../models/player');
var Game       = require('../../models/game');
var Logger     = require('../../helpers/logger');
var Query      = require('../../helpers/query');
var GameHelper = require('../../helpers/game');
var Notifications = require('../../helpers/notifications');

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

/* Add a game vs the winner of another game to the queue */
exports.playWinner = function(player1, gameId, io) {
    player1 = GameHelper.formatName(player1);
    Game.findById(gameId, function(error, parentGame) {
      if (player1 != parentGame.player1 && player1 != parentGame.player2) {
        var player2 = 'Winner of ' + parentGame.player1 + ' vs. ' + parentGame.player2;
        if (player1.length >= 2 && player2.length >= 2 && player1 !== player2) {
          Logger.info('Queue ' + player1 + ' vs. ' + player2);

          var createdGame = new Game();
          GameHelper.findOrCreatePlayer(createdGame, player1, io);
          GameHelper.findOrCreatePlayer(createdGame, player2, io);
          if (error) {
            Logger.error('Problem fiding game: ' + gameId + ' to play winner of: ' + error);
          }
          Logger.info('Player ' + player1 + ' playing winner of game ' + parentGame._id);
          parentGame.childGameId = createdGame._id;
          parentGame.save();

          Query.pushDataToSockets(io);
        }else {
          Logger.warn('Error ' + player1 + ' vs. ' + player2);
        }
      }
    });
  };

/* Remove the game from the queue */
exports.abandon = function(gameId, io) {
      var saveGame;
      Game.findById(gameId, function(error, game) {
        if (error) {
          Logger.error('Problem finding game: ' + gameId + ' to abandon: ' + error);
        }
        Game.find({childGameId: gameId}).exec(function(error, games) {
          games.forEach(function(entry) {
            Logger.info('Removing child game from game: ' + entry._id);
            entry.childGameId = undefined;
            entry.save();
          });
        });
        if (game & game.childGameId) {
          exports.abandon(game.childGameId, io);
        }
        Logger.info('Abandon game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
        game.winner = 'Abandoned';
        game.save();

        GameHelper.removeInactivePlayer(game.player1, io);
        GameHelper.removeInactivePlayer(game.player2, io);
        Game.findById(gameId).remove().exec();

        Query.pushDataToSockets(io);
        firenotifications();
      });
    };

/* Complete a game */
exports.complete = function(gameId, winner, io) {
    Game.findById(gameId, function(error, game) {
          if (error) {
            Logger.error('Problem finding game: ' + gameId + ', with the winner: ' + winner + ' to complete game: ' + error);
          }
          if (game.winner) {
            Query.pushDataToSockets(io);
            if (game.childGameId != undefined) {
              Game.findById(game.childGameId, function(error, childGame) {
                if (error) {
                  Logger.error('Problem finding child game: ' + game.childGameId);
                } else {
                  var originalPlayer = childGame.player2;
                  childGame.player2 = game.winner;
                  childGame.save();
                  GameHelper.removeInactivePlayer(originalPlayer, io);
                }
              });
            }
          } else {
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
            if (game.childGameId != undefined) {
              Game.findById(game.childGameId, function(error, childGame) {
                if (error) {
                  Logger.error('Problem finding child game: ' + game.childGameId);
                } else {
                  var originalPlayer = childGame.player2;
                  childGame.player2 = game.winner;
                  childGame.save();
                  GameHelper.removeInactivePlayer(originalPlayer, io);
                }
              });
            }
            Query.pushDataToSockets(io);
            firenotifications();
          }
        });
    
  };

function firenotifications(){
  // Game.find({ winner: null }, { __v: 0 }).sort({ time: 'ascending' }).limit(25).lean().exec(function (error, games) {
  //     if (games.length > 0){
  //       Notifications.SendNotifications(games);
  //     }
  // });
}