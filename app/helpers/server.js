'use strict';

/* NPM Packages*/

/* Imports */

/* Variables */

/* Functions */
exports.requireHTTPS = function(req, res, next) {
    if (req.secure) {
        next();
    } else {
        if (req.method === 'GET') {
            res.redirect(301, 'https://' + req.headers.host + req.originalUrl);
        } else {
            res.status(403).send('Please use HTTPS when submitting data to this server.');
        }
    }
}
