/// <reference path="../../typings/globals/durandal/index.d.ts" />
/// <reference path="../../typings/globals/socket.io-client/index.d.ts" />
import system = require('durandal/system');
import app = require('durandal/app');
import io = require('socket.io-client');
import eventTypes = require('../datamodels/eventTypes');
import SecurityService = require('../../services/security');

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
            if (data.waitinglist){
                app.trigger(eventTypes.WaitingListUpdate, data.waitinglist);
            }
        });
        this.socket.on('player stats', function(data) {
            if (data.stats){
                app.trigger(eventTypes.StatsDataUpdate, data.stats);
            }
        });
        this.socket.on('update waitinglist', function(data) {
            if (data.waitinglist){
                app.trigger(eventTypes.WaitingListUpdate, data.waitinglist);
            }
        });
    }

    public Start(){
        this.socket.emit('update all');
    }

    Refresh(){
        this.socket.emit('update all');
    }

    CreateGame(player1, player2){
        this.socket.emit('create game', player1, player2);
    }

    SetWinner(gameId, winner){
        this.socket.emit('complete game', gameId, winner);
    }

    AddToWaitingList(player){
        this.socket.emit('addto waitinglist', player);
    }

    RemoveFromWaitingList(player){
        this.socket.emit('remove waitinglist', player);
    }

    CreateGameFromWaitingList(player1, player2){
        this.socket.emit('create game fromwaiting', player1, player2);
    }

    GetStats(player){
        this.socket.emit('player stats', player);
    }

    RemoveGame(gameId){
        this.socket.emit('delete game', gameId);
    }

    PlayWinner(player, gameId){
        this.socket.emit('play winner', player, gameId);
    }

    UpdatePlayer(playername, mobilenumber, enableNotification){
        this.socket.emit('player update', playername, mobilenumber, enableNotification);
    }
}
export =SocketService;
