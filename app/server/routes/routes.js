'use strict';

/* NPM Packages*/

/* Imports */

/* Variables */

/* Functions */

/* Routes */
module.exports = function(router) {
    /* Sub Routes */
    require('./player.routes')(router);
    // require('./itemData.routes')(router);

    /* Root Route */
    router.get('/api', function(request, response) {
        response.json({API: 'It\'s alive!'});
      });

    /* 404 Route */
    router.get('*', function(request, response) {
        response.status(404).send('404');
      });

  };
