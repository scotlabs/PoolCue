'use strict';

/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Logger = require('../../helpers/logger');
var Player = require('../../models/player');
var Game   = require('../../models/game');

/* Global Variables */

/* Functions */

/* Import player from our hand written score system */
exports.importPlayer = function(playerName, importedWins, importedLosses) {
    var player = new Player({name: playerName, wins: importedWins, losses: importedLosses});

    Logger.info('Importing ' + player.name + ' | Wins ' + wins + ' - ' + losses + ' Losses ');
    player.save();
  };

/* Complete a game */
exports.getStats = function(playerName, socket, request, response) {
          Player.findOne({name: playerName}, function(error, player) {
              Game.find({$or: [{player1: playerName}, {player2: playerName}]}).sort('descending').lean().exec(function(error, games) {

                    var playerStats = {
                        player: player,
                        last10games: getLast10Games(playerName, games),
                        playerMostPlayed: getPlayerMostPlayed(playerName, games),
                        winStreak: getWinStreak(playerName, games)
                      };
                    if (socket) {
                      socket.emit('player stats', {stats: playerStats});
                    }else {
                      response.json(playerStats);
                    }
                  });
            });
        };

exports.updateMobile = function(playerName, mobile_number, enableNotification){
   Player.findOne({name: playerName}, function(error, player) {
     player.mobile_number = mobile_number;
     player.enableNotification = enableNotification;
     player.save();
   });
};

function getLast10Games(playerName, games) {
  var last10games = [];
  for (var i = games.length; i >= 0; i--) {
    if (games[i] && last10games.length < 10 && games[i].winner) {
      if (games[i].winner === playerName) {
        last10games.push(true);
      }else if (games[i].winner !== 'Abandoned') {
        last10games.push(false);
      }
    }
  }

  return last10games;
}

function getPlayerMostPlayed(playerName, games) {
  var opponents = [];
  for (var i = 0; i < games.length; i++) {
    if (games[i].winner !== 'Abandoned') {
      if (games[i].player1 !== playerName) {
        opponents.push(games[i].player1);
      }else {
        opponents.push(games[i].player2);
      }
    }
  }

  var frequency = {};
  var numberOfGames = 0;
  var mostPlayedPlayer;
  for (var j in opponents) {
    frequency[opponents[j]] = (frequency[opponents[j]] || 0) + 1;
    if (frequency[opponents[j]] > numberOfGames) {
      numberOfGames = frequency[opponents[j]];
      mostPlayedPlayer = opponents[j];
    }
  }

  return new Object({
        player: mostPlayedPlayer,
        games: numberOfGames
      });
}

function getWinStreak(playerName, games) {
  var longestWinStreak = 0;
  var current = 0;
  for (var i = 0; i < games.length; i++) {
    if (playerName === games[i].winner) {
      current ++;
      if (current > longestWinStreak) {
        longestWinStreak = current;
      }
    }else {
      current = 0;
    }
  }

  return longestWinStreak;
}
