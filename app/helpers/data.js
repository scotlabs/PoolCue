/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Game    = require('../models/game');
var Player  = require('../models/player');
var Helpers = require('../helpers/game');
var Logger  = require('../helpers/logger');
var Query   = require('../helpers/query');

/* Global Variables */
var EloRanking = new Elo();

exports.createPlayersFromGames = function() {
    Game.find({}).sort({time: 'ascending'}).exec(function(error, games) {
        Player.remove({}).exec();
        for (var i = 0; i < games.length; i++) {
          new Player({name: games[i].player1}).save();
          new Player({name: games[i].player2}).save();
        }
      });
    generateScoreFromGames();
  };

function generateScoreFromGames() {
  Game.find({}).sort({time: 'ascending'}).exec(function(error, games) {
      for (var i = 0; i < games.length; i++) {
        var game = games[i];
        Player.find({name: {$in: [games[i].player1, games[i].player2]}}, function(error, players) {
              if (players[0].name == game.winner) {
                Helpers.updatePlayers(players[0], players[1], null);
              }else if (players[1].name == game.winner) {
                Helpers.updatePlayers(players[1], players[0], null);
              }
            });
      }
    });
};
