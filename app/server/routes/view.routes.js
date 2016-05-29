'use strict';

/* NPM Packages*/

/* Imports */
var Players = require('../../models/playerQuery');

/* Variables */

/* Routes */
module.exports = function(Router) {

    Router.get('/', function(request, response) {
        response.render('../app/views/index.ejs');
      });

    Router.get('/table', Players.getAll, function(request, response) {
        response.render('../app/views/elements/table.ejs', {players: request.result});
      });

  };
