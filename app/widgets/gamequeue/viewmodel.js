define(["require", "exports", 'knockout', '../../datamodels/gameData'], function (require, exports, ko, gameData) {
    "use strict";
    var QueueView = (function () {
        function QueueView() {
            var _this = this;
            this.GamesData = gameData.Games;
            this.HasQueue = ko.computed(function () {
                return gameData.Games().length > 1;
            });
            this.NextGamesCount = ko.computed(function () {
                var numberOfGames = gameData.Games().length;
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