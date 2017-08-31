define(["require", "exports", 'knockout', '../../datamodels/gameData', '../../services/socketservice'], function (require, exports, ko, gameData, SocketService) {
    "use strict";
    var LeaderboardView = (function () {
        function LeaderboardView() {
            this.IsLiberated = function (data) {
                return data.liberated || false;
            };
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
            this.isActive = function(player){
                var thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);
                var playerLastActive = new Date(player.updatedAt)
                return player.updatedAt !== null && playerLastActive >= thirtyDaysAgo
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
            this.PlayerData = gameData.Players;
            this.HasPlayers = ko.computed(function () {
                return gameData.Players().length > 0;
            });
        }
        return LeaderboardView;
    }());
    return LeaderboardView;
});
//# sourceMappingURL=viewmodel.js.map