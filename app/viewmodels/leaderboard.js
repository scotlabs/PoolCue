define(["require", "exports", 'knockout', '../datamodels/gamedata'], function (require, exports, ko, gamedata) {
    "use strict";
    var LeaderboardView = (function () {
        function LeaderboardView() {
            var _this = this;
            this.PlayerData = gamedata.Players;
            _this.HasPlayers = ko.computed(function () {
                return gamedata.Players().length > 0;
            });
        }
        return LeaderboardView;
    }());
    return LeaderboardView;
});
//# sourceMappingURL=leaderboard.js.map