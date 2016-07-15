'use strict';

/* NPM Packages*/

/* Imports */

/* Variables */

/* Functions */
exports.requireHTTPS = function(request, response, next) {
    if (request.secure) {
      next();
    } else {
      if (request.method === 'GET') {
        response.redirect(301, 'https://' + request.headers.host + request.originalUrl);
      } else {
        response.status(403).send('Please use HTTPS when submitting data to this server.');
      }
    }
  };
