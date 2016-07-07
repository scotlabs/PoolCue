define(["require", "exports", 'socketio'], function (require, exports, socket) {
    "use strict";
    var SocketService = (function () {
        function SocketService() {
        }
        SocketService.prototype.Initialise = function () {
            socket.on('update data', function (data) {
                //addPlayerTypeAhead(data.players);
                //addNewLeaderboard(data.players);
                //addNewGameToQueue(data.games);
                //addNewCurrentlyPlaying(data.games[0]);
                //toggleButtons();
            });
            socket.on('player stats', function (data) {
                //addDataToPlayerStatsModal(data.stats);
            });
        };
        SocketService.prototype.Start = function () {
            socket.emit('update all');
        };
        return SocketService;
    }());
    return SocketService;
});
//# sourceMappingURL=socketservice.js.map