'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../../models/player.js');

/* Variables */

/* Routes */
module.exports = function(Router) {

    Router.get('/', function(request, response) {
        response.render('../app/views/index.ejs');
      });

    Router.get('/table', function(request, response) {
        response.render('../app/views/elements/table.ejs');
      });

  };
