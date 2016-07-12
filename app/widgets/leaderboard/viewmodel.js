define(["require", "exports", 'knockout', '../../datamodels/gamedata', '../../services/socketservice'], function (require, exports, ko, gamedata, SocketService) {
    "use strict";
    var LeaderboardView = (function () {
        function LeaderboardView() {
            this.PlayerDelta = function (player) {
                return (player.wins * 1 - player.losses * 1);
            };
            this.PlayerDeltaDesc = function (player) {
                var $delta = this.PlayerDelta(player);
                if ($delta > 0) {
                    return '+ ' + $delta;
                }
                else if ($delta < 0) {
                    return '- ' + Math.abs($delta);
                }
                else {
                    return '0';
                }
            };
            this.PlayerDeltaCss = function (player) {
                var $delta = this.PlayerDelta(player);
                if ($delta > 0) {
                    return 'bg-success';
                }
                else if ($delta < 0) {
                    return 'bg-warning';
                }
                else {
                    return '';
                }
            };
            this.GetStats = function (data) {
                new SocketService().GetStats(data.name);
            };
            this.socketService = new SocketService();
            this.PlayerData = gamedata.Players;
            this.HasPlayers = ko.computed(function () {
                return gamedata.Players().length > 0;
            });
        }
        return LeaderboardView;
    }());
    return LeaderboardView;
});
//# sourceMappingURL=viewmodel.js.map