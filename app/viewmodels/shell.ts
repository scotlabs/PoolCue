/// <reference path="../../typings/globals/knockout/index.d.ts" />
/// <reference path="../../typings/globals/durandal/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/bootstrap/index.d.ts" />
import system = require('durandal/system');
import app = require('durandal/app');
import dialog = require('plugins/dialog');
import composition = require('durandal/composition');
import router = require('plugins/router');
import eventTypes = require('../datamodels/eventTypes');
import gameData = require('../datamodels/gameData');
import SocketService = require('../services/socketservice');
import ko = require('knockout');
import socket = require('socket.io-client');
class Shell {


    socketService: SocketService;
    constructor() {
        this.socketService = new SocketService();
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
    router = router;
    compositionComplete = function () {
        this.socketService.Start();
    };
    attached = function () {
        // $(window).focus(function () {
        //     socket.emit('update all');
        // });
        this.socketService.Initialise();
    }
    activate = function () {
        return router.map([
            { route: '', moduleId: 'viewmodels/index' },
            { route: 'screen', moduleId: 'viewmodels/screen' },
        ]).buildNavigationModel()
            .mapUnknownRoutes('hello/index', 'not-found')
            .activate();
    }
}
export =Shell;
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
    } else {
        return '0';
    }
}

function last10games(games) {
    var gameString = '';
    for (var i = 0; i < games.length; i++) {
        if (games[i]) {
            gameString += '<span class="text-success">W</span>';
        } else {
            gameString += '<span class="text-danger">L</span>';
        }
    }
    return gameString;
}