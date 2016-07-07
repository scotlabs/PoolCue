/// <reference path="../../typings/globals/durandal/index.d.ts" />
/// <reference path="../../typings/globals/socket.io/index.d.ts" />
import system = require('durandal/system');
import socket = require('socketio');

class SocketService {

    constructor() {

    }

    public Initialise(){
        socket.on('update data', function(data) {
             //addPlayerTypeAhead(data.players);
            //addNewLeaderboard(data.players);
            //addNewGameToQueue(data.games);
            //addNewCurrentlyPlaying(data.games[0]);
            //toggleButtons();
        });
        socket.on('player stats', function(data) {
            //addDataToPlayerStatsModal(data.stats);
        });
    }

    public Start(){
        socket.emit('update all');
    }

}
export =SocketService;
