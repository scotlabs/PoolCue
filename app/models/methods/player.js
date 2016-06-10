'use strict';

/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Logger = require('../../helpers/logger');
var Player = require('../../models/player.js');

/* Global Variables */
var EloRanking = new Elo();

/* Functions */

/* Import player from our hand written score system */
exports.importPlayer = function(playerName, importedWins, importedLosses) {
    var player = new Player({name: playerName, wins: importedWins, losses: importedLosses});

    Logger.info('Importing ' + player.name + ' | Wins ' + wins + ' - ' + losses + ' Losses ';
    player.save();
  };
