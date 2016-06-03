'use strict';

/* NPM Packages*/
var Mongoose = require('mongoose');
var Elo      = require('elo-js');

/* Imports */
var Player = require('../models/player.js');
var Game   = require('../models/game.js');
var GameQuery = require('../models/gameQuery');
var Logger   = require('../helpers/logger');
var Query   = require('../helpers/query');

/* Global Variables */
var EloRanking = new Elo();

/* Functions */

/* Add a game to the queue */
exports.queue = function(request, response, next) {
      if (request.body.player1 !== '' && request.body.player2 !== '' && request.body.player1 !== request.body.player2) {
        Logger.info('Queue ' + request.body.player1 + ' vs. ' + request.body.player2);
        findOrCreatePlayer(request.body.player1, request.body.player2, response, next);
      }else {
        Logger.warn('Error ' + request.body.player1 + ' vs. ' + request.body.player2);
        next();
      }
    };

exports.queue2 = function(player1, player2, io) {
      if (player1 !== '' && player2 !== '' && player1 !== player2) {
        Logger.info('Queue ' + player1 + ' vs. ' + player2);
        findOrCreatePlayer2(player1, player2, io);
      }else {
        Logger.warn('Error ' + player1 + ' vs. ' + player2);
      }
    };

/* Remove the game from the queue */
exports.abandon = function(request, response, next) {
    Game.findById(request.params.id, function(error, game) {
        game.winner = 'Abandoned';
        game.save();
        Logger.info('Abandon game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
        next();
      });
  };

exports.abandon2 = function(id, io) {
    Game.findById(id, function(error, game) {
        game.winner = 'Abandoned';
        game.save();
        Logger.info('Abandon game: ' + game._id + ' - ' + game.player1 + ' vs. ' + game.player2);
        Query.homePageSockets(io);
      });
  };

/* Complete a game */
exports.complete = function(request, response, next) {
    Game.findById(request.params.id, function(error, game) {
          var winner = request.params.winner;
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
          next();
        });
  };

exports.getLeaderboard = function(io) {
  Player.find({}).sort({elo: 'descending'}).exec(function(error, players) {
      console.log(players);
      io.emit('update leaderboard', {
        players: players
      });
    });
};
/* Create helper function for game queue */
function findOrCreatePlayer(player1Name, player2Name, response, next) {
  var game = new Game();
  Player.findOne({name: player1Name}, function(error, player1) {
    if (!player1) {
      player1 = new Player({name: player1Name});
      player1.save();
      Logger.info('Create new player: ' +  player1.name);
    }
    game.player1 = player1.name;
    game.save();
  });

  Player.findOne({name: player2Name}, function(error, player2) {
    if (!player2) {
      player2 = new Player({name: player2Name});
      player2.save();
      Logger.info('Create new player: ' +  player2.name);
    }
    game.player2 = player2.name;
    game.save();
    next();
  });
}

/* Create helper function for game queue */
function findOrCreatePlayer2(player1Name, player2Name, io) {
  var game = new Game();
  Player.findOne({name: player1Name}, function(error, player1) {
    if (!player1) {
      player1 = new Player({name: player1Name});
      player1.save();
      Logger.info('Create new player: ' +  player1.name);
    }
    game.player1 = player1.name;
    game.save();
  });

  Player.findOne({name: player2Name}, function(error, player2) {
    if (!player2) {
      player2 = new Player({name: player2Name});
      player2.save();
      Logger.info('Create new player: ' +  player2.name);
    }
    game.player2 = player2.name;
    game.save();

    Query.homePageSockets(io);

  });
}

/* Update helper function for game complete */
function updatePlayers(winner, loser) {
  Logger.info('Start ' + winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
  winner.elo = EloRanking.ifWins(winner.elo, loser.elo);
  winner.wins++;
  winner.save();

  loser.elo = EloRanking.ifLoses(loser.elo, winner.elo);
  loser.losses++;
  loser.save();
  Logger.info('End ' + winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
};
