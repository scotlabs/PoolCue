define(["require", "exports", 'knockout', '../datamodels/gameData'], function (require, exports, ko, gameData) {
    "use strict";
    var LeaderboardView = (function () {
        function LeaderboardView() {
            var _this = this;
            this.PlayerData = gameData.Players;
            _this.HasPlayers = ko.computed(function () {
                return gameData.Players().length > 0;
            });
        }
        return LeaderboardView;
    }());
    return LeaderboardView;
});
//# sourceMappingURL=leaderboard.js.map