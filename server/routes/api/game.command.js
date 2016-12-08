'use strict';

/* Imports */
var Game = require('../../models/methods/game');

/* Routes */
module.exports = function (Router, io) {
	var root = '/api/games/'

	// Endpoint: Create
	// Example: POST - example.com/api/games/create?player1=Fred&player2=George
	Router.post(root + 'create', function (request, response) {
		if(request.query.player1 && request.query.player2){
			Game.queue(request.query.player1, request.query.player2, io);
			response.sendStatus(200);
		}else{
			response.status(400).send('Missing parameter data');
		}
	});

	// Endpoint: Play Winner
	// Example: POST - example.com/api/games/playwinner?gameId=183c519f7b99fceab00820570&player=George
	Router.post(root + 'playwinner', function (request, response) {
		if(request.query.gameId && request.query.player){
			Game.complete(request.query.player, request.query.gameId, io);
			response.sendStatus(200);
		}else{
			response.status(400).send('Missing parameter data');
		}
	});

	// Endpoint: Delete
	// Example: POST - example.com/api/games/delete?gameId=183c519f7b99fceab00820570
	Router.post(root + 'delete', function (request, response) {
		if(request.query.gameId){
			Game.abandon(request.query.gameId, io);
			response.sendStatus(200);
		}else{
			response.status(400).send('Missing parameter data');
		}
	});

	// Endpoint: Complete
	// Example: POST - example.com/api/games/complete?gameId=183c519f7b99fceab00820570&winner=George
	Router.post(root + 'complete', function (request, response) {
		if(request.query.gameId && request.query.winner){
			Game.complete(request.query.gameId, request.query.winner, io);
			response.sendStatus(200);
		}else{
			response.status(400).send('Missing parameter data');
		}
	});

};
