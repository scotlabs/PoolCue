'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
var Elo      = require('elo-js');

/* Imports */
var Player    = require('../models/player.js');
var Game      = require('../models/game.js');
var GameQuery = require('../models/gameQuery');
var Logger    = require('../helpers/logger');
var Query     = require('../helpers/query');

/* Global Variables */
var EloRanking = new Elo();

/* Functions */

/* Add a game to the queue */
exports.queue = function(player1, player2, io) {
      player1 = formatName(player1);
      player2 = formatName(player2);
      if (player1 !== '' && player2 !== '' && player1 !== player2) {
        Logger.info('Queue ' + player1 + ' vs. ' + player2);

        var game = new Game();
        findOrCreatePlayer(game, player1, io);
        findOrCreatePlayer(game, player2, io);
      }else {
        Logger.warn('Error ' + player1 + ' vs. ' + player2);
      }
    };

/* Remove the game from the queue */
exports.abandon = function(gameId, io) {
    Game.findById(gameId, function(error, game) {
        if (error) {
          Logger.error('Problem fiding game: ' + gameId + ' to abandon.');
        }
        Logger.info('Abandon game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
        game.winner = 'Abandoned';
        game.save();
        removeInactivePlayer(game.player1);
        removeInactivePlayer(game.player2);

        Query.homePageSockets(io);
      });
  };

exports.updateAll = function(io) {
    Query.homePageSockets(io);
  };

/* Complete a game */
exports.complete = function(gameId, winner, io) {
    Game.findById(gameId, function(error, game) {
          if (error) {
            Logger.error('Problem finding game: ' + gameId + ', with the winner: ' + winner + ' to complete game.');
          }
          game.winner = winner;
          game.save();
          var loser = game.player2;
          if (game.player1 != winner) {
            loser = game.player1;
          }

          Player.find({name: {$in: [winner, loser]}}, function(error, players) {
              if (players[0].name == winner) {
                updatePlayers(players[0], players[1], io);
              }else {
                updatePlayers(players[1], players[0], io);
              }
            });
        });
  };

/* Create helper function for game queue */
function findOrCreatePlayer(game, playerName, io) {
  Player.findOne({name: playerName}, function(error, player) {
      if (error) {
        Logger.error('Problem finding player: ' + playerName + ' to find or create.');
      }
      if (!player) {
        player = new Player({name: playerName});
        player.save();
        Logger.info('Create new player: ' +  player.name);
      }

      if (!game.player1) {
        game.player1 = player.name;
        game.save();
      }else {
        game.player2 = player.name;
        game.save();

        Query.homePageSockets(io);
      }
    });
}
/* Update helper function for game complete */
function updatePlayers(winner, loser, io) {
  Logger.info('Start ' + winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
  winner.elo = EloRanking.ifWins(winner.elo, loser.elo);
  winner.wins++;
  winner.save();

  loser.elo = EloRanking.ifLoses(loser.elo, winner.elo);
  loser.losses++;
  loser.save();
  Logger.info('End ' + winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);

  Query.homePageSockets(io);
};

/* Removes player if 0 wins & 0 losses */
function removeInactivePlayer(playerName) {
  Player.findOne({name: playerName}).exec(function(error, result) {
      if (error) {
        Logger.error('Problem finding player: ' + playerName + ' to check if active.');
      }
      if (result && result.wins === 0 && result.losses === 0) {
        Logger.info('Removing player: ' +  playerName);
        Player.find({name: playerName}).remove().exec();
      }
    });
}

function formatName(playerName) {
  return playerName.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).substring(0, 50);
}
