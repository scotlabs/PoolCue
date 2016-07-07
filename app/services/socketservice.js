define(["require", "exports", 'durandal/app', 'socket.io-client', '../datamodels/eventTypes'], function (require, exports, app, io, eventTypes) {
    "use strict";
    var SocketService = (function () {
        function SocketService() {
            this.socket = io.connect('http://localhost');
        }
        SocketService.prototype.Initialise = function () {
            this.socket.on('update data', function (data) {
                if (data.players) {
                    app.trigger(eventTypes.PlayerDataUpdate, data.players);
                }
                if (data.games) {
                    app.trigger(eventTypes.GamesDataUpdate, data.games);
                }
                //addPlayerTypeAhead(data.players);
                //addNewLeaderboard(data.players);
                //addNewGameToQueue(data.games);
                //addNewCurrentlyPlaying(data.games[0]);
                //toggleButtons();
            });
            this.socket.on('player stats', function (data) {
                if (data.stats) {
                    app.trigger(eventTypes.StatsDataUpdate, data.stats);
                }
                //addDataToPlayerStatsModal(data.stats);
            });
        };
        SocketService.prototype.Start = function () {
            this.socket.emit('update all');
        };
        SocketService.prototype.CreateGame = function (player1, player2) {
            this.socket.emit('create game', player1, player2);
        };
        SocketService.prototype.SetWinner = function (gameId, winner) {
            this.socket.emit('complete game', gameId, winner);
        };
        return SocketService;
    }());
    return SocketService;
});
//# sourceMappingURL=socketservice.js.map