define(["require", "exports", 'durandal/app', 'plugins/router', '../datamodels/eventTypes', '../datamodels/gamedata', '../services/socketservice', 'knockout'], function (require, exports, app, router, eventTypes, gamedata, SocketService, ko) {
    "use strict";
    var Shell = (function () {
        function Shell() {
            this.router = router;
            this.activate = function () {
                this.socketService.Start();
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
            var _this = this;
            _this.HasQueue = ko.computed(function () {
                return gamedata.Games().length > 1;
            });
            _this.HasWaiting = ko.computed(function () {
                return gamedata.PlayersWaiting().length > 1;
            });
        }
        return Shell;
    }());
    return Shell;
});
//# sourceMappingURL=shell.js.map