define(["require", "exports", 'durandal/app', 'plugins/router', '../datamodels/eventTypes', '../datamodels/gameData', '../services/socketservice', '../services/security'], function (require, exports, app, router, eventTypes, gameData, SocketService, SecurityService) {
    "use strict";
    var Shell = (function () {
        function Shell() {
            this.router = router;
            this.compositionComplete = function () {
                var _this = this;
                this.socketService.Start();
                $(window).focus(function () {
                    _this.socketService.Refresh();
                });
            };
            this.attached = function () {
                // $(window).focus(function () {
                //     socket.emit('update all');
                // });
                this.security.Refresh();
                this.socketService.Initialise();
            };
            this.activate = function () {
                var _this = this;
                return router.map([
                    { route: '', moduleId: 'viewmodels/index' },
                    { route: 'login', moduleId: 'viewmodels/login' },
                    { route: 'signout', moduleId: 'viewmodels/signout' },
                    { route: 'notifications', moduleId: 'viewmodels/notifications' },
                    { route: 'screen', moduleId: 'viewmodels/screen' },
                ])
                    .buildNavigationModel()
                    .activate();
            };
            this.socketService = new SocketService();
            this.security = new SecurityService();
            var _this = this;
            app.on(eventTypes.PlayerDataUpdate).then(function (eventData) {
                gameData.Players(eventData);
            });
            app.on(eventTypes.GamesDataUpdate).then(function (eventData) {
                gameData.Games(eventData);
            });
            app.on(eventTypes.WaitingListUpdate).then(function (eventData) {
                gameData.PlayersWaiting(eventData);
            });
            app.on(eventTypes.StatsDataUpdate).then(function (stats) {
                if (!stats.player)
                    return;
                $('#modalLabel').text(stats.player.name);
                $('#modalContent').html(formatPlayerlayerStats(stats));
            });
        }
        return Shell;
    }());
    function formatPlayerlayerStats(stats) {
        last10games(stats.last10games);
        return '<div class="row">' +
            '<div class="text-center">' +
            '&nbsp;&nbsp;&nbsp;&nbsp;(Wins) ' + stats.player.wins + '&nbsp; - &nbsp;' +
            stats.player.losses + ' (Losses)' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-6 text-right">' +
            'Win %:' +
            '</div>' +
            '<div class="col-xs-6 text-left">' +
            getWinPercentage(stats.player) + ' %' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-6 text-right">' +
            'Elo:' +
            '</div>' +
            '<div class="col-xs-6 text-left">' +
            stats.player.elo +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-6 text-right">' +
            'Last 10:' +
            '</div>' +
            '<div class="col-xs-6 text-left">' +
            last10games(stats.last10games) +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-6 text-right">' +
            'Win Streak:' +
            '</div>' +
            '<div class="col-xs-6 text-left">' +
            stats.winStreak +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-6 text-right">' +
            'Most Played:' +
            '</div>' +
            '<div class="col-xs-6 text-left">' +
            stats.playerMostPlayed.player + ' (' + stats.playerMostPlayed.games + ')' +
            '</div>' +
            '</div>';
    }
    function getWinPercentage(player) {
        if (player.wins > 0 || player.wins > 0) {
            return Math.round(player.wins / (player.wins + player.losses) * 100);
        }
        else {
            return '0';
        }
    }
    function last10games(games) {
        var gameString = '';
        for (var i = 0; i < games.length; i++) {
            if (games[i]) {
                gameString += '<span class="text-success">W</span>';
            }
            else {
                gameString += '<span class="text-danger">L</span>';
            }
        }
        return gameString;
    }
    return Shell;
});
//# sourceMappingURL=shell.js.map