/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Game    = require('../models/game');
var Player  = require('../models/player');
var Helpers = require('./game');
var Logger  = require('./logger');

/* Global Variables */

exports.createPlayersFromGames = function() {
    Game.find({}).sort({time: 'ascending'}).exec(function(error, games) {
        Logger.warn('Deleting all users.');
        Player.remove({}).exec();
        games.forEach(function(game) {
          new Player({name: game.player1}).save();
          new Player({name: game.player2}).save();
        });
      });
    this.generateScoreFromGames();
  };

exports.generateScoreFromGames = function() {
  Game.find({}).sort({time: 'ascending'}).exec(function(error, games) {
    Logger.warn('Regenerating all users.');
    games.forEach(function(game) {
       Player.find({name: {$in: [game.player1, game.player2]}}, function(error, players) {
          if(players){
            if (players[0].name == game.winner) {
              Helpers.updatePlayers(players[0], players[1], null);
            } else if (players[1].name == game.winner) {
              Helpers.updatePlayers(players[1], players[0], null);
            }
          }
        });
      });
    });
};
