'use strict';

/* Routes */
module.exports = function(Router, io) {
    /* Game */
    require('./game.query')(Router);
    require('./game.command')(Router, io);
    /* Player */
    require('./player.query')(Router);
};