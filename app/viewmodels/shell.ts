/// <reference path="../../typings/globals/knockout/index.d.ts" />
/// <reference path="../../typings/globals/durandal/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/bootstrap/index.d.ts" />
import system = require('durandal/system');
import dialog = require('plugins/dialog');
import composition = require('durandal/composition');
import router = require('plugins/router');
import dataProvider = require('../datamodels/dataProvider');
import SocketService = require('../services/socketservice');
import ko = require('knockout');

class Shell {
    socketService : SocketService;
    constructor() {
        this.socketService = new SocketService();
    }
    public router = router;
    activate = function () {
        this.socketService.Initialise();
        var configs = new dataProvider();
        router.map([
            { route: '', title:'Home', moduleId: 'viewmodels/home', nav: true },
            { route: 'leaderboard', title:'Leaderboard', moduleId: 'viewmodels/leaderboard', nav: true},
        ]).buildNavigationModel();
        return router.activate();
    };
    attached = function () {
       this.socketService.Start();
    }
}
export =Shell;