'use strict';

/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Logger = require('../../helpers/logger');
var Player = require('../../models/player.js');
var Game = require('../../models/game.js');

/* Global Variables */
var EloRanking = new Elo();

/* Functions */

/* Import player from our hand written score system */
exports.importPlayer = function(playerName, importedWins, importedLosses) {
    var player = new Player({name: playerName, wins: importedWins, losses: importedLosses});

    Logger.info('Importing ' + player.name + ' | Wins ' + wins + ' - ' + losses + ' Losses ');
    player.save();
  };

/* Complete a game */
exports.getStats = function(playerName) {
          Player.find({name: playerName}, function(error, player) {
              Game.find({$or: [{player1: playerName}, {player2: playerName}]}).lean().exec(function(error, games) {
                  // Last 10 games. (WLLLWWWLWW)
                  var last10games = [];
                  for (var i = 0; i < 10; i++) {
                    if (games[i]) {
                      if (games[i].winner === playerName) {
                        last10games.push(true);
                      }else {
                        last10games.push(false);
                      }
                    }
                  }
                  console.log(last10games);

                  // Player most played. (Wins - Losses)
                  var opponents = [];
                  for (var i = 0; i < games.length; i++) {
                    if (games[i].player1 !== playerName) {
                      opponents.push(games[i].player1);
                    }else {
                      opponents.push(games[i].player2);
                    }
                  }
                  console.log(opponents);

                  var frequency = {};
                  var numberOfGames = 0;
                  var mostPlayedPlayer;
                  for (var i in opponents) {
                    frequency[opponents[i]] = (frequency[opponents[i]] || 0) + 1;
                    if (frequency[opponents[i]] > numberOfGames) {
                      numberOfGames = frequency[opponents[i]];
                      mostPlayedPlayer = opponents[i];
                    }
                  }
                  console.log(mostPlayedPlayer + ' ' + numberOfGames);
                  // Longest win streak.
                  for (var i = 0; i < games.length; i++) {

                  }
                  // Nemisis
                });
            });
        };
