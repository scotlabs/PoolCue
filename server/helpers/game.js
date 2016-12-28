/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Game = require('../models/game');
var WaitingList = require('../models/waiting');
var Player = require('../models/player');
var Logger = require('./logger');
var Sockets = require('./sockets');

/* Global Variables */
var EloRanking = new Elo();

exports.findOrCreateWaitingPlayer = function (waitingList, playerName) {
  Player.findOne({ name: playerName }, function (error, player) {
    if (error) {
      Logger.error('Problem finding player: ' + playerName + ' to find or create:' + error);
      return;
    }
    if (!player) {
      player = createPlayer(playerName);
    }
    waitingList.player = player.name;
    waitingList.save();
  });
};

/* Update helper function for game complete */
exports.updatePlayers = function (winner, loser, io) {
  winner.elo = EloRanking.ifWins(winner.elo, loser.elo);
  winner.wins++;
  winner.save();

  loser.elo = EloRanking.ifLoses(loser.elo, winner.elo);
  loser.losses++;
  loser.save();
  Logger.info(winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
  Sockets.push(io);
};

/* Removes player if 0 wins & 0 losses */
exports.removeInactivePlayer = function (playerName, io) {
  var result = Game.find({$or: [{ player1: playerName}, { player2: playerName }]}).exec();
  result.then(function(games){
    if (games.length < 1) {
      Logger.info('Removing player: ' + playerName);
      Player.find({ name: playerName }).remove().exec();
      Sockets.push(io);
    }
  });
};

exports.removePlayerFromWaitingList = function (playerName, io) {
  WaitingList.find({ player: playerName }).remove().exec(function () {
    Sockets.push(io);
  });
};

exports.formatName = function (playerName) {
  return playerName.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }).replace(/[^a-zA-Z0-9' ]/g, '').substring(0, 50).trim();
};

function createPlayer(playerName, io) {
  Logger.info('Create new player: ' + playerName);
  player = new Player({ name: playerName });
  player.save();
  Sockets.push(io);

  return player;
}