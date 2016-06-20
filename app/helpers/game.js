
/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Player = require('../models/player.js');
var Game   = require('../models/game.js');
var Logger = require('../helpers/logger');
var Query  = require('../helpers/query');

/* Global Variables */
var EloRanking = new Elo();

/* Create helper function for game queue */
exports.findOrCreatePlayer = function(game, playerName, io) {
  Player.findOne({name: playerName}, function(error, player) {
      if (error) {
        Logger.error('Problem finding player: ' + playerName + ' to find or create:' + error);
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

        Query.pushDataToSockets(io);
      }
    });
};
/* Update helper function for game complete */
exports.updatePlayers = function(winner, loser, io) {
    Logger.info('Start ' + winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
    winner.elo = EloRanking.ifWins(winner.elo, loser.elo);
    winner.wins++;
    winner.save();

    loser.elo = EloRanking.ifLoses(loser.elo, winner.elo);
    loser.losses++;
    loser.save();
    Logger.info('End ' + winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);

    Query.pushDataToSockets(io);
  };

/* Removes player if 0 wins & 0 losses */
exports.removeInactivePlayer = function(playerName, io) {
  Game.find({$or: [{player1: playerName}, {player2: playerName}]}).exec(function(error, result) {
    if (result.length <= 1) {
      Player.findOne({name: playerName}).exec(function(error, result) {
          if (error) {
            Logger.error('Problem finding player: ' + playerName + ' to check if active: ' + error);
          }
          Logger.info('Removing player: ' +  playerName);
          Player.find({name: playerName}).remove().exec();
          Query.pushDataToSockets(io);
        });
    }
  });
};

exports.formatName = function(playerName) {
  return playerName.replace(/\w\S*/g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/[^a-zA-Z0-9' ]/g, '').substring(0, 50);
};
