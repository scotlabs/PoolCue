/// <reference path="../../typings/globals/durandal/index.d.ts" />
/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />
import system = require('durandal/system');
import app = require('durandal/app');
import io = require('socket.io-client');
import eventTypes = require('../datamodels/eventTypes');

class SocketService {
    socket:SocketIOClient.Socket;
    constructor() {
        this.socket = io.connect('http://localhost');
    }

    public Initialise(){
        this.socket.on('update data', function(data) {
            if (data.players){
                app.trigger(eventTypes.PlayerDataUpdate, data.players);
            }
            if (data.games){
                app.trigger(eventTypes.GamesDataUpdate, data.games);
            }
            //addPlayerTypeAhead(data.players);
            //addNewLeaderboard(data.players);
            //addNewGameToQueue(data.games);
            //addNewCurrentlyPlaying(data.games[0]);
            //toggleButtons();
        });
        this.socket.on('player stats', function(data) {
            if (data.stats){
                app.trigger(eventTypes.StatsDataUpdate, data.stats);
            }
            //addDataToPlayerStatsModal(data.stats);
        });
    }

    public Start(){
        this.socket.emit('update all');
    }

    CreateGame(player1, player2){
        this.socket.emit('create game', player1, player2);
    }

    SetWinner(gameId, winner){
        this.socket.emit('complete game', gameId, winner);
    }

}
export =SocketService;
