'use strict';

/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Logger = require('../helpers/logger');
var Player = require('../models/player.js');

/* Global Variables */
var EloRanking = new Elo();

/* Functions */

/* Import player from our hand written score system */
exports.importPlayer = function(playerName, wins, losses) {
    var player = new Player({name: playerName});

    for (var j = 0; j < losses; j++) {
      player.elo = EloRanking.ifLoses(player.elo, 1000);
      player.losses++;
    }

    for (var i = 0; i < wins; i++) {
      player.elo = EloRanking.ifWins(player.elo, 1000);
      player.wins++;
    }

    Logger.info('Importing ' + player.name + ' | Wins ' + wins + ' - ' + losses + ' Losses ' + '| (' + player.elo + ')');
    player.save();
  };
