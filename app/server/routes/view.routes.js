'use strict';

/* NPM Packages*/

/* Imports */
var Query = require('../../helpers/query');
var Players = require('../../models/playerQuery');
var Games = require('../../models/gameQuery');
var GameFunctions = require('../../models/gameFunctions');

/* Variables */

/* Routes */
module.exports = function(Router) {

    Router.get('/', Query.homePage, function(request, response) {
        response.render('../app/views/index', {queue: request.queue, players: request.players});
      });

    Router.get('/table', Players.getAll, function(request, response, next) {
        response.render('../app/views/elements/table', {players: request.result});
      });

    Router.route('/queue')
      .get(Games.getQueue, function(request, response) {
          response.render('../app/views/elements/queue', {queue: request.result});
        })
      .post(GameFunctions.queue, function(request, response) {
          //
        });



    Router.get('/queue/abandon/:id', GameFunctions.abandon, function(request, response) {
        // GameFunctions jumps in here.
        response.redirect('/queue');
      });

    Router.get('/playing', Games.getQueue,  function(request, response) {
        response.render('../app/views/elements/playing', {queue: request.result});
      });

  };
