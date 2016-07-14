define(["require", "exports", 'amplify'], function (require, exports, amplify) {
    "use strict";
    var SecurityService = (function () {
        function SecurityService() {
            this.IsAuthenticated = function () {
                return this.GetUser() != null;
            };
            this.SignIn = function (username) {
                this.StoreUser(username);
                return true;
            };
            this.GetUser = function () {
                var name = amplify.store("UserKey");
                this.PlayerName(name);
                return name;
            };
            this.StoreUser = function (username) {
                var userDetail = amplify.store("UserKey", username);
                return userDetail;
            };
            this.PlayerName = ko.observable();
        }
        return SecurityService;
    }());
    return SecurityService;
});
//# sourceMappingURL=security.js.map