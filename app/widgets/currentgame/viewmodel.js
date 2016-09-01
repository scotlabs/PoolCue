define(["require", "exports", 'knockout', '../../datamodels/gameData', '../../services/socketservice', '../../services/security'], function (require, exports, ko, gameData, SocketService, SecurityService) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel() {
            this.attached = function () {
                var _this = this;
                gameData.Games.subscribe(function (eventData) {
                    _this.Game(eventData[0]);
                    _this.setGame();
                });
            };
            this.activate = function () {
            };
            this.compositioncomplete = function () {
                if (gameData.Games() && gameData.Games()[0]) {
                    this.Game(gameData.Games()[0]);
                    this.setGame();
                }
            };
            var _this = this;
            this.security = new SecurityService();
            this.socketService = new SocketService();
            this.Game = ko.observable(null);
            this.Player1 = ko.observable();
            this.Player2 = ko.observable();
            this.HasGame = ko.computed(function () {
                var game = ko.unwrap(this.Game);
                if (game) {
                    return game._id != null;
                }
                return false;
            }, this);
            this.CanSetWinner = ko.observable(true);
            this.CanPlayWinner = ko.computed(function () {
                var game = ko.unwrap(this.Game);
                if (!ko.unwrap(this.HasGame)) {
                    return false;
                }
                return ko.unwrap(game.player1) != this.security.GetUser() &&
                    ko.unwrap(game.player2) != this.security.GetUser() &&
                    game.childGameId == undefined;
            }, this);
        }
        ViewModel.prototype.setGame = function () {
            if (!this.Game) {
                this.Player1(null);
                this.Player2(null);
                this.CanSetWinner(true);
                this.CanPlayWinner(false);
                return;
            }
            var game = this.Game();
            if (!game)
                return;
            this.Player1(game.player1);
            this.Player2(game.player2);
            this.CanSetWinner(true);
        };
        ViewModel.prototype.setWinner = function (data) {
            var player = ko.unwrap(data);
            var game = ko.unwrap(this.Game);
            var confirmed = confirm(player + " won this game?");
            if (!confirmed) {
                return;
            }
            this.CanSetWinner(false);
            this.socketService.SetWinner(game._id, player);
        };
        ViewModel.prototype.AbandonCurrentGame = function () {
            if (confirm("Are you sure?")) {
                this.socketService.RemoveGame(ko.unwrap(this.Game)._id);
            }
        };
        ViewModel.prototype.PlayWinner = function () {
            if (confirm("Play winner?")) {
                this.socketService.PlayWinner(this.security.GetUser(), ko.unwrap(this.Game)._id);
            }
        };
        return ViewModel;
    }());
    return ViewModel;
});
//# sourceMappingURL=viewmodel.js.map