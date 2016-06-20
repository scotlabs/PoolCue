/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Player = require('../models/player.js');
var Game   = require('../models/game.js');
var Helpers = require('../helpers/game');
var Logger = require('../helpers/logger');
var Query  = require('../helpers/query');

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
        Player.find({$or: [{name: games[i].player1}, {name: games[i].player2}]}).lean().exec(function(error, result) {
              if (game.winner === result[0].name) {
                // Pass reults + game and the call save on results?
                Helpers.updatePlayers(result[0], result[1], null);
              }else if (game.winner === result[1].name) {
                Helpers.updatePlayers(result[1], result[0], null);
              }
            });
      }
    });
};
