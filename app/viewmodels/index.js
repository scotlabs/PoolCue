define(["require", "exports", '../datamodels/gameData', '../services/security', '../services/socketservice', 'plugins/router'], function (require, exports, gameData, SecurityService, SocketService, router) {
    "use strict";
    var IndexViewModel = (function () {
        /**
         *
         */
        function IndexViewModel() {
            this.canActivate = function () {
                if (!this.security.IsAuthenticated()) {
                    return { redirect: 'login' };
                }
                return true;
            };
            this.attached = function () {
                this.sockets.Refresh();
            };
            this.security = new SecurityService();
            this.sockets = new SocketService();
            this.HasQueue = ko.computed(function () {
                return gameData.Games().length > 1;
            });
            this.HasWaiting = ko.computed(function () {
                return gameData.PlayersWaiting().length > 1;
            });
            this.PlayerName = this.security.PlayerName;
        }
        IndexViewModel.prototype.SetNotifications = function () {
            router.navigate("notifications");
        };
        IndexViewModel.prototype.SignOut = function () {
            router.navigate("signout");
        };
        return IndexViewModel;
    }());
    return IndexViewModel;
});
//# sourceMappingURL=index.js.map