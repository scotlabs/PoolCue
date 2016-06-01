'use strict';

/* NPM Packages*/

/* Imports */
var Query = require('../../helpers/query');
var GameFunctions = require('../../models/gameFunctions');

/* Variables */

/* Routes */
module.exports = function(Router) {

    Router.get('/', Query.homePage, function(request, response, next) {
        response.render('../app/views/index', {queue: request.queue, players: request.players});
      });

    Router.route('/queue')
      .post(GameFunctions.queue, function(request, response, next) {
          response.redirect('/');
        });

    Router.get('/abandon/:id', GameFunctions.abandon, function(request, response, next) {
        response.redirect('/');
      });

    Router.get('/complete/:id/:winner', GameFunctions.complete, function(request, response, next) {
        response.redirect('/');
      });

  };
