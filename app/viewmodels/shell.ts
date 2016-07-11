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

    HasQueue: KnockoutObservable<boolean>;
    HasWaiting: KnockoutObservable<boolean>;

    socketService : SocketService;
    constructor() {
        this.socketService = new SocketService();
        var _this = this;
         _this.HasQueue = ko.computed(function(){
            return gamedata.Games().length > 1;
        });
         _this.HasWaiting = ko.computed(function(){
            return gamedata.PlayersWaiting().length > 1;
        });
        app.on(eventTypes.PlayerDataUpdate).then(function(eventData){
            gamedata.Players(eventData);
        });
        app.on(eventTypes.GamesDataUpdate).then(function(eventData){
            gamedata.Games(eventData);
        });
        app.on(eventTypes.WaitingListUpdate).then(function(eventData){
            gamedata.PlayersWaiting(eventData);
        });
    }
    router = router;
    activate = function () {
        this.socketService.Start();
    };
    attached = function () {
       
        this.socketService.Initialise();
    }
}
export =Shell;
