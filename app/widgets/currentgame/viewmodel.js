define(["require", "exports", 'knockout', '../../datamodels/gameData', '../../services/socketservice', '../../services/security'], function (require, exports, ko, gameData, SocketService, SecurityService) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel() {
            this.attached = function () {
                var _this = this;
                gameData.Games.subscribe(function (eventData) {
                    _this.Game = eventData[0];
                    _this.setGame();
                });
            };
            this.activate = function () {
            };
            this.compositioncomplete = function () {
                if (gameData.Games() && gameData.Games()[0]) {
                    this.Game = gameData.Games()[0];
                    this.setGame();
                }
            };
            var _this = this;
            this.security = new SecurityService();
            this.socketService = new SocketService();
            this.Player1 = ko.observable();
            this.Player2 = ko.observable();
            this.HasGame = ko.observable(false);
            this.CanSetWinner = ko.observable(true);
            this.CanPlayWinner = ko.observable(false);
        }
        ViewModel.prototype.setGame = function () {
            if (!this.Game) {
                this.Player1(null);
                this.Player2(null);
                this.HasGame(false);
                this.CanSetWinner(true);
                this.CanPlayWinner(false);
                return;
            }
            this.Player1(this.Game.player1);
            this.Player2(this.Game.player2);
            this.HasGame(this.Game._id != null);
            this.CanPlayWinner((this.Game.Player1 != this.security.GetUser() &&
                this.Game.Player2 != this.security.GetUser() &&
                this.Game.childGameId == undefined));
        };
        ViewModel.prototype.setWinner = function (data) {
            var player = ko.unwrap(data);
            var confirmed = confirm(player + " won this game?");
            if (!confirmed) {
                return;
            }
            this.CanSetWinner(false);
            this.CanPlayWinner(false);
            this.socketService.SetWinner(this.Game._id, player);
        };
        ViewModel.prototype.AbandonCurrentGame = function () {
            if (confirm("Are you sure?")) {
                this.socketService.RemoveGame(this.Game._id);
            }
        };
        ViewModel.prototype.PlayWinner = function () {
            if (confirm("Play winner?")) {
                this.CanPlayWinner(false);
                this.socketService.PlayWinner(this.security.GetUser(), this.Game._id);
            }
        };
        return ViewModel;
    }());
    return ViewModel;
});
//# sourceMappingURL=viewmodel.js.map