'use strict';

/* NPM Packages*/
var Elo      = require('elo-js');

/* Imports */
var Alerts   = require('../helpers/alerts');
var User = require('../models/user.js');

/* Global Variables */
var elo = new Elo();

/* Functions */
exports.importUser = function(userName, wins, losses) {
    var user = new User({name: userName});

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
