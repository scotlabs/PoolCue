'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../../models/player');
var PlayerMethods = require('../../models/methods/player');
var Game = require('../../models/game');
var Logger = require('../../helpers/logger');
var Sockets = require('../../helpers/sockets');
var GameHelper = require('../../helpers/game');
/* Global Variables */

/* Functions */

/* Add a game to the queue */
exports.queue = function (player1, player2, io) {
  if (player1.length >= 2 && player2.length >= 2 && player1 !== player2) {
    var newGame = createGame(player1, player2, io);
    newGame.then(function(){
      Sockets.push(io);
    });
  } else {
    Logger.warn('Could not create game: ' + player1 + ' vs. ' + player2);
  }
};

function createGame(player1, player2, io) {
  var player1Name = GameHelper.formatName(player1);
  var player2Name = GameHelper.formatName(player2);

  Logger.info('Creating Game: ' + player1Name + ' vs. ' + player2Name);
  PlayerMethods.create(player1Name);
  PlayerMethods.create(player2Name);

  return new Game({
    player1 : player1Name,
    player2 : player2Name
  }).save();
}

/* Add a game vs the winner of another game to the queue */
exports.playWinner = function (player1, gameId, io) {
  player1 = GameHelper.formatName(player1);
  var result = Game.findById(gameId);
  result.then(function (parentGame) {
    if (player1 !== parentGame.player1 && player1 !== parentGame.player2) {
      var player2 = 'Winner of ' + parentGame.player1 + ' vs. ' + parentGame.player2;
      if (player1.length >= 2 && player2.length >= 2 && player1 !== player2) {
        var createdGame = createGame(player1, player2, io);
        createdGame.then(function(game){
          Logger.info('Player ' + player1 + ' playing winner of game ' + parentGame._id);
          parentGame.childGameId = game._id;
          parentGame.save();
          Sockets.push(io);
        });
      } else {
        Logger.warn('Error ' + player1 + ' vs. ' + player2);
      }
    }
  });
};

exports.abandon = function (gameId, io) {
  var targetGame = Game.findById(gameId);
  targetGame.then(function(game){
    Logger.info('Abandon game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
    if(game.childGameId){
      Logger.info('Abandoning child game: ' + game.childGameId);
      exports.abandon(game.childGameId, io);
    }
    GameHelper.removeInactivePlayer(game.player1, io);
    GameHelper.removeInactivePlayer(game.player2, io);
    Game.findById(gameId).remove().exec();
  });
};

/* Complete a game */
exports.complete = function (gameId, winner, io) {
  Game.findById(gameId, function (error, game) {
    if (error) {
      Logger.error('Problem finding game: ' + gameId + ', with the winner: ' + winner + ' to complete game: ' + error);
    }
    if (game.winner) {
      Sockets.push(io);
      updateChildGame(game);
    } else {
      game.winner = winner;
      game.save();
      var loser = game.player2;
      if (game.player1 !== winner) {
        loser = game.player1;
      }
      Player.find({name: { $in: [winner, loser] }}, function (error, players) {
        if (players[0].name == winner) {
          GameHelper.updatePlayers(players[0], players[1], io);
        } else {
          GameHelper.updatePlayers(players[1], players[0], io);
        }
      });
      updateChildGame(game, io);
      Sockets.push(io);
    }
  });
};

function updateChildGame(game, io) {
  if (game.childGameId !== undefined) {
    Game.findById(game.childGameId, function (error, childGame) {
      if (error) {
        Logger.error('Problem finding child game: ' + game.childGameId);
      } else {
        var originalPlayer = childGame.player2;
        childGame.player2 = game.winner;
        childGame.save();
        GameHelper.removeInactivePlayer(originalPlayer);
        Sockets.push(io);
      }
    });
  }
}