'use strict';

/* NPM Packages*/
var Elo      = require('elo-js');
var Alerts   = require('../helpers/alerts');

/* Imports */
var User = require('../models/user.js');

/* Global Variables */
var elo = new Elo();

/* Functions */
exports.completeGame = function(winner, loser) {
    Alerts.logMessage('Start', winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
    winner.elo = elo.ifWins(winner.elo, loser.elo);
    winner.wins++;
    winner.save();

    loser.elo = elo.ifLoses(loser.elo, winner.elo);
    loser.losses++;
    loser.save();
    Alerts.logMessage(' End ', winner.name + ' (' + winner.elo + ') vs. (' + loser.elo + ') ' + loser.name);
  };

exports.importStats = function(user, wins, losses) {
    for (var j = 0; j < losses; j++) {
      user.elo = elo.ifLoses(user.elo, 1000);
      user.losses++;
    }

    for (var i = 0; i < wins; i++) {
      user.elo = elo.ifWins(user.elo, 1000);
      user.wins++;
    }

    Alerts.logMessage('Import', user.name + ' | Wins ' + wins + ' - ' + losses + ' Losses ' + '| (' + user.elo + ')');
    user.save();
  };
