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
import gamedata = require('../datamodels/gamedata');
import SocketService = require('../services/socketservice');
import ko = require('knockout');

class Shell {
    socketService : SocketService;
    constructor() {
        this.socketService = new SocketService();
    }
    router = router;
    activate = function () {
        router.map([
            { route: '', title:'Home', moduleId: 'viewmodels/home', nav: true },
            { route: 'leaderboard', title:'Leaderboard', moduleId: 'viewmodels/leaderboard', nav: true},
            { route: 'info', title:'Information', moduleId: 'viewmodels/info', nav: true},
        ]).buildNavigationModel();
        this.socketService.Start();
        return router.activate();
    };
    attached = function () {
        this.socketService.Initialise();
        app.on(eventTypes.PlayerDataUpdate).then(function(eventData){
            gamedata.Players(eventData);
        })
        app.on(eventTypes.GamesDataUpdate).then(function(eventData){
            gamedata.Games(eventData);
        })
    }
}
export =Shell;
