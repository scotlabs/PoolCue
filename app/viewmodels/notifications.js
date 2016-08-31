define(["require", "exports", 'plugins/router', '../services/security', '../services/socketservice', 'plugins/http'], function (require, exports, router, SecurityService, SocketService, http) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel() {
            this.canActivate = function () {
                if (!this.security.IsAuthenticated()) {
                    return { redirect: 'login' };
                }
                return true;
            };
            this.activate = function () {
                var _this = this;
                http.get('/api/player/' + this.PlayerName(), null, {}).then(function (response) {
                    if (response == null || response.length != 1)
                        return;
                    var data = response[0];
                    _this.MobileNumber(data.mobile_number);
                }, function (error) {
                    alert(error);
                });
            };
            this.socketService = new SocketService();
            this.security = new SecurityService();
            this.PlayerName = this.security.PlayerName;
            this.MobileNumber = ko.observable();
        }
        ViewModel.prototype.Save = function () {
            this.socketService.UpdatePlayer(this.security.PlayerName(), this.MobileNumber());
        };
        ViewModel.prototype.SignOut = function () {
            router.navigate("signout");
        };
        return ViewModel;
    }());
    return ViewModel;
});
//# sourceMappingURL=notifications.js.map