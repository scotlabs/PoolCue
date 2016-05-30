'use strict';

/* NPM Packages*/

/* Imports */
var Players = require('../../models/playerQuery');
var Games = require('../../models/gameQuery');
var GameFunctions = require('../../models/gameFunctions');

/* Variables */

/* Routes */
module.exports = function(Router) {

    Router.get('/', function(request, response) {
        response.render('../app/views/index');
      });

    Router.get('/table', Players.getAll, function(request, response) {
        response.render('../app/views/elements/table', {players: request.result});
      });

    Router.get('/queue', Games.getQueue, function(request, response) {
        response.render('../app/views/elements/queue', {queue: request.result});
      });

    Router.get('/queue/abandon/:id', GameFunctions.abandon, function(request, response) {
        // GameFunctions jumps in here.
        response.redirect('/queue');
      });

  };
