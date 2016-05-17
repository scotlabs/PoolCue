'use strict';

/* NPM Packages*/

/* Imports */
var Player = require('../../models/user');

/* Variables */

/* Functions */

/* Routes */
module.exports = function(Router) {

    /* All players */
    Router.get('/players', function(req, res) {
        Player.find({}).limit(250).lean().exec(function(err, result) {
            res.json(result);
          });
      });
  };
