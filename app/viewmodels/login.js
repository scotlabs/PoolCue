define(["require", "exports", '../datamodels/gameData', '../services/security', 'plugins/router'], function (require, exports, gameData, SecurityService, router) {
    "use strict";
    var AccountViewModel = (function () {
        function AccountViewModel() {
            this.activate = function () {
            };
            this.LogIn = function () {
                if (!this.PlayerName() || this.PlayerName() == '')
                    return;
                var signedIn = this.security.SignIn(this.PlayerName());
                if (signedIn) {
                    router.navigate("");
                }
            };
            var _this = this;
            this.PlayerName = ko.observable();
            this.PlayerData = gameData.Players;
            this.security = new SecurityService();
            this.CanSignIn = ko.computed(function () {
                return _this.PlayerName() && _this.PlayerName() != '';
            });
        }
        return AccountViewModel;
    }());
    return AccountViewModel;
});
//# sourceMappingURL=login.js.map