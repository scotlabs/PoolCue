define(["require", "exports", 'knockout', '../../datamodels/gamedata'], function (require, exports, ko, gamedata) {
    "use strict";
    var QueueView = (function () {
        function QueueView() {
            var _this = this;
            this.GamesData = gamedata.Games;
            this.HasQueue = ko.computed(function () {
                return gamedata.Games().length > 1;
            });
            this.NextGamesCount = ko.computed(function () {
                var numberOfGames = gamedata.Games().length;
                if (numberOfGames > 5)
                    return "5";
                else if (numberOfGames > 1)
                    return "" + numberOfGames;
                else if (numberOfGames == 1)
                    return "";
            });
        }
        return QueueView;
    }());
    return QueueView;
});
//# sourceMappingURL=viewmodel.js.map