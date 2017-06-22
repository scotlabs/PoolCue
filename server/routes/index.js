'use strict';

/* Routes */
module.exports = function(Router, io) {
    /* Game */
    require('./api/v1/')(Router);

    /* Root Route */
    Router.get('/', function(request, response) {
        response.render('../app/views/index');
    });

    Router.get('/api', function(request, response) {
        response.json({ API: 'It\'s alive!' });
    });

    /* 404 Route */
    Router.get('*', function(request, response) {
        console.log(request.url);
        response.status(404).send('404');
    });
};