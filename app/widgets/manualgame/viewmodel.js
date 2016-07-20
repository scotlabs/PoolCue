define(["require", "exports", '../../services/socketservice', '../../datamodels/gameData', '../../services/security'], function (require, exports, SocketService, gameData, SecurityService) {
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
            this.security = new SecurityService();
            this.Player1Name = ko.observable(this.security.GetUser());
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