define(["require", "exports", 'knockout', '../../datamodels/gamedata', '../../services/socketservice'], function (require, exports, ko, gamedata, SocketService) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel() {
            this.attached = function () {
                // app.on(eventtypes.GamesDataUpdate).then(function(eventData){
                //     var data = eventData[0];
                //     _this.CurrentGame.Player1(data.player1);
                //     _this.CurrentGame.Player2(data.player2);
                //     _this.CurrentGame.Active = data._id != null;
                // }); 
            };
            this.activate = function () {
            };
            this.socketService = new SocketService();
            this.Player1 = ko.observable();
            this.Player2 = ko.observable();
            this.Active = ko.observable(false);
            var _this = this;
            if (gamedata.Games() && gamedata.Games()[0]) {
                this.Game = gamedata.Games()[0];
                this.setGame();
            }
            gamedata.Games.subscribe(function (eventData) {
                _this.Game = eventData[0];
                _this.setGame();
            });
        }
        ViewModel.prototype.setGame = function () {
            if (!this.Game) {
                this.Player1(null);
                this.Player2(null);
                this.Active(false);
                return;
            }
            this.Player1(this.Game.player1);
            this.Player2(this.Game.player2);
            this.Active(this.Game._id != null);
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