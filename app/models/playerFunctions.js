'use strict';

/* NPM Packages*/
var Elo = require('elo-js');

/* Imports */
var Alerts = require('../helpers/alerts');
var Player = require('../models/player.js');

/* Global Variables */
var elo = new Elo();

/* Functions */

/* Import player from our hand written score system */
exports.importPlayer = function(playerName, wins, losses) {
    var player = new Player({name: playerName});

    for (var j = 0; j < losses; j++) {
      player.elo = elo.ifLoses(player.elo, 1000);
      player.losses++;
    }

    for (var i = 0; i < wins; i++) {
      player.elo = elo.ifWins(player.elo, 1000);
      player.wins++;
    }

    Alerts.logMessage('Import', player.name + ' | Wins ' + wins + ' - ' + losses + ' Losses ' + '| (' + player.elo + ')');
    player.save();
  };
