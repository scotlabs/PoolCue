'use strict';

/* Imports */
var Game = require('../../models/methods/game');

/* Routes */
module.exports = function (Router, io) {

	Router.post('/games/create', function (request, response) {
		if(request.query.player1 && request.query.player2){
			Game.queue(request.query.player1, request.query.player2, io);
			response.sendStatus(200);
		}else{
			response.status(400).send('Missing parameter data');
		}
	});

	Router.post('/games/delete', function (request, response) {
		if(request.query.gameId){
			Game.queue(request.query.gameId, io);
			response.sendStatus(200);
		}else{
			response.status(400).send('Missing parameter data');
		}
	});

	Router.post('/games/complete', function (request, response) {
		if(request.query.gameId && request.query.winner){
			Game.complete(request.query.gameId, request.query.winner, io);
			response.sendStatus(200);
		}else{
			response.status(400).send('Missing parameter data');
		}
	});
};
