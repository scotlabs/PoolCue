define(["require", "exports", 'plugins/router', '../datamodels/dataProvider', '../services/socketservice'], function (require, exports, router, dataProvider, SocketService) {
    "use strict";
    var Shell = (function () {
        function Shell() {
            this.router = router;
            this.activate = function () {
                this.socketService.Initialise();
                var configs = new dataProvider();
                router.map([
                    { route: '', title: 'Home', moduleId: 'viewmodels/home', nav: true },
                    { route: 'leaderboard', title: 'Leaderboard', moduleId: 'viewmodels/leaderboard', nav: true },
                ]).buildNavigationModel();
                return router.activate();
            };
            this.attached = function () {
                this.socketService.Start();
            };
            this.socketService = new SocketService();
        }
        return Shell;
    }());
    return Shell;
});
//# sourceMappingURL=shell.js.map