define(["require", "exports", '../services/security', 'plugins/router'], function (require, exports, SecurityService, router) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel() {
            this.activate = function () {
                new SecurityService().SignOut();
                router.navigate("");
            };
        }
        return ViewModel;
    }());
    return ViewModel;
});
//# sourceMappingURL=signout.js.map