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
                if (data.waitinglist) {
                    app.trigger(eventTypes.WaitingListUpdate, data.waitinglist);
                }
            });
            this.socket.on('player stats', function (data) {
                if (data.stats) {
                    app.trigger(eventTypes.StatsDataUpdate, data.stats);
                }
            });
            this.socket.on('update waitinglist', function (data) {
                if (data.waitinglist) {
                    app.trigger(eventTypes.WaitingListUpdate, data.waitinglist);
                }
            });
        };
        SocketService.prototype.Start = function () {
            this.socket.emit('update all');
        };
        SocketService.prototype.Refresh = function () {
            this.socket.emit('update all');
        };
        SocketService.prototype.CreateGame = function (player1, player2) {
            this.socket.emit('create game', player1, player2);
        };
        SocketService.prototype.SetWinner = function (gameId, winner) {
            this.socket.emit('complete game', gameId, winner);
        };
        SocketService.prototype.AddToWaitingList = function (player) {
            this.socket.emit('addto waitinglist', player);
        };
        SocketService.prototype.RemoveFromWaitingList = function (player) {
            this.socket.emit('remove waitinglist', player);
        };
        SocketService.prototype.CreateGameFromWaitingList = function (player1, player2) {
            this.socket.emit('create game fromwaiting', player1, player2);
        };
        SocketService.prototype.GetStats = function (player) {
            this.socket.emit('player stats', player);
        };
        SocketService.prototype.RemoveGame = function (gameId) {
            this.socket.emit('delete game', gameId);
        };
        SocketService.prototype.PlayWinner = function (player, gameId) {
            this.socket.emit('play winner', player, gameId);
        };
        return SocketService;
    }());
    return SocketService;
});
//# sourceMappingURL=socketservice.js.map
