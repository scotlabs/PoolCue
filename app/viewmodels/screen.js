define(["require", "exports", '../datamodels/gameData'], function (require, exports, gameData) {
    "use strict";
    var ScreenViewModel = (function () {
        /**
         *
         */
        function ScreenViewModel() {
            this.Game = null;
            this.attached = function () {
            };
            this.compositioncomplete = function () {
                if (gameData.Games() && gameData.Games()[0]) {
                    this.Game = gameData.Games()[0];
                    this.setGame();
                }
            };
            this.setGame = function () {
                if (!this.Game) {
                    this.Player1(null);
                    this.Player2(null);
                    this.HasGame(false);
                    return;
                }
                this.Player1(this.Game.player1);
                this.Player2(this.Game.player2);
                this.HasGame(this.Game._id !== null);
            };
            var _this = this;
            this.HasGame = ko.observable(false);
            this.HasQueue = ko.computed(function () {
                return gameData.Games().length > 1;
            });
            this.HasWaiting = ko.computed(function () {
                return gameData.PlayersWaiting().length > 0;
            });
            this.Player1 = ko.observable();
            this.Player2 = ko.observable();
            this.HasPlayers = ko.computed(function () {
                return gameData.Players().length > 0;
            });
            this.GamesData = gameData.Games;
            this.WaitingList = gameData.PlayersWaiting;
            this.PlayerData = gameData.Players;
            this.NextGamesCount = ko.computed(function () {
                var numberOfGames = gameData.Games().length - 1;
                if (numberOfGames > 5)
                    return "5";
                else if (numberOfGames > 1)
                    return "" + numberOfGames;
                else if (numberOfGames === 1)
                    return "";
            });
            gameData.Games.subscribe(function (eventData) {
                _this.Game = eventData[0];
                _this.setGame();
            });
        }
        return ScreenViewModel;
    }());
    return ScreenViewModel;
});
//# sourceMappingURL=screen.js.map