define(["require", "exports", 'knockout', '../../datamodels/gameData', '../../services/socketservice'], function (require, exports, ko, gameData, SocketService) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel() {
            this.attached = function () {
                var _this = this;
                // app.on(eventtypes.GamesDataUpdate).then(function(eventData){
                //     var data = eventData[0];
                //     _this.CurrentGame.Player1(data.player1);
                //     _this.CurrentGame.Player2(data.player2);
                //     _this.CurrentGame.Active = data._id != null;
                // }); 
                gameData.Games.subscribe(function (eventData) {
                    _this.Game = eventData[0];
                    _this.setGame();
                });
            };
            this.activate = function () {
            };
            this.socketService = new SocketService();
            this.Player1 = ko.observable();
            this.Player2 = ko.observable();
            this.HasGame = ko.observable(false);
            var _this = this;
            if (gameData.Games() && gameData.Games()[0]) {
                this.Game = gameData.Games()[0];
                this.setGame();
            }
        }
        ViewModel.prototype.setGame = function () {
            if (!this.Game) {
                this.Player1(null);
                this.Player2(null);
                this.HasGame(false);
                return;
            }
            this.Player1(this.Game.player1);
            this.Player2(this.Game.player2);
            this.HasGame(this.Game._id != null);
        };
        ViewModel.prototype.setWinner = function (data) {
            this.socketService.SetWinner(this.Game._id, ko.unwrap(data));
        };
        return ViewModel;
    }());
    var Game = (function () {
        function Game() {
        }
        return Game;
    }());
    return ViewModel;
});
//# sourceMappingURL=viewmodel.js.map