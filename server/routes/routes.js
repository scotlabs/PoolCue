'use strict';

/* Routes */
module.exports = function (Router, io) {
	/* Sub Routes */
	require('./api/game.query')(Router);
	require('./api/game.command')(Router, io);
	
	require('./api/player.query')(Router);

	/* Root Route */

	Router.get('/', function (request, response, next) {
		response.render('../app/views/index');
	});

	Router.get('/api', function (request, response) {
		response.json({
			API: 'It\'s alive!'
		});
	});

	/* 404 Route */
	Router.get('*', function (request, response) {
		response.status(404).send('404');
	});

};
