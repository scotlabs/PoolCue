define(["require", "exports", '../../services/socketservice', '../../datamodels/gameData', '../../services/security'], function (require, exports, SocketService, gameData, SecurityService) {
    "use strict";
    var ManualAddViewModel = (function () {
        function ManualAddViewModel() {
            this.activate = function () {
            };
            this.AddManualGame = function () {
                if (this.Player1Name() === "" || this.Player2Name() === "") {
                    return;
                }
                this.socketService.CreateGame(this.Player1Name(), this.Player2Name());
                this.Player1Name(this.security.GetUser()); //Set Player1Name back to Player's Name
                this.Player2Name('');
            };
            var _this = this;
            this.socketService = new SocketService();
            this.security = new SecurityService();
            this.Player1Name = ko.observable(this.security.GetUser());
            this.Player2Name = ko.observable('');
            this.PlayerData = gameData.Players;
        }
        return ManualAddViewModel;
    }());
    return ManualAddViewModel;
});
//# sourceMappingURL=viewmodel.js.map