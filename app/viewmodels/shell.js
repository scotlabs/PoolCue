define(["require", "exports", 'durandal/app', 'plugins/router', '../datamodels/eventTypes', '../datamodels/gamedata', '../services/socketservice'], function (require, exports, app, router, eventTypes, gamedata, SocketService) {
    "use strict";
    var Shell = (function () {
        function Shell() {
            this.router = router;
            this.activate = function () {
                router.map([
                    { route: '', title: 'Home', moduleId: 'viewmodels/home', nav: true },
                    { route: 'leaderboard', title: 'Leaderboard', moduleId: 'viewmodels/leaderboard', nav: true },
                    { route: 'info', title: 'Information', moduleId: 'viewmodels/info', nav: true },
                ]).buildNavigationModel();
                this.socketService.Start();
                return router.activate();
            };
            this.attached = function () {
                this.socketService.Initialise();
                app.on(eventTypes.PlayerDataUpdate).then(function (eventData) {
                    gamedata.Players(eventData);
                });
                app.on(eventTypes.GamesDataUpdate).then(function (eventData) {
                    gamedata.Games(eventData);
                });
            };
            this.socketService = new SocketService();
        }
        return Shell;
    }());
    return Shell;
});
//# sourceMappingURL=shell.js.map