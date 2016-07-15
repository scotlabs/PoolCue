define(["require", "exports", '../../services/socketservice', '../../datamodels/gameData'], function (require, exports, SocketService, gameData) {
    "use strict";
    var ManualAddViewModel = (function () {
        function ManualAddViewModel() {
            this.activate = function () {
            };
            this.AddManualGame = function () {
                if (!this.CanAddManualGame()) {
                    return;
                }
                this.socketService.CreateGame(this.Player1Name(), this.Player2Name());
                this.Player1Name('');
                this.Player2Name('');
            };
            var _this = this;
            this.socketService = new SocketService();
            this.Player1Name = ko.observable('');
            this.Player2Name = ko.observable('');
            this.CanAddManualGame = ko.computed({
                owner: this,
                read: function () {
                    return _this.Player1Name().length > 0 && _this.Player2Name().length > 0;
                }
            });
            this.PlayerData = gameData.Players;
        }
        return ManualAddViewModel;
    }());
    return ManualAddViewModel;
});
//# sourceMappingURL=viewmodel.js.map