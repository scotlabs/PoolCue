'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../../models/player');
var Query = require('../routes/query');

/* Variables */

/* Routes */
module.exports = function(Router) {

  /* All players */
  Router.get('/api/players', function(request, response) {
    Query.find(Player, {}, response);
    });

  /* Player by name */
  Router.get('/api/players/:name', function(request, response) {
      console.log(request.connection.remoteAddress)
      Query.find(Player, {name : req.params.name}, response);
  });

  };
