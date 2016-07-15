define(["require", "exports", 'knockout', '../../datamodels/gameData', '../../services/socketservice'], function (require, exports, ko, gameData, SocketService) {
    "use strict";
    var QueueView = (function () {
        function QueueView() {
            this.RemoveGame = function ($data) {
                new SocketService().RemoveGame($data._id);
            };
            var _this = this;
            this.socketService = new SocketService();
            this.GamesData = gameData.Games;
            this.HasQueue = ko.computed(function () {
                return gameData.Games().length > 1;
            });
            this.NextGamesCount = ko.computed(function () {
                var numberOfGames = gameData.Games().length - 1;
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