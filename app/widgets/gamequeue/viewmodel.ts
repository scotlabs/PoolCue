import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../../datamodels/eventTypes');
import gameData = require('../../datamodels/gameData');
import Game = require('../../datamodels/game');
import SocketService = require('../../services/socketservice');
import SecurityService = require('../../services/security');

class QueueView {

    HasQueue: KnockoutComputed<boolean>;
    GamesData: KnockoutObservableArray<Game>;
    NextGamesCount: KnockoutComputed<string>;
    socketService:SocketService;
    security: SecurityService;
    _this: QueueView;
    constructor() {
        this._this = this;
        this.security = new SecurityService();
        this.socketService = new SocketService();
        this.GamesData = gameData.Games;
        this.HasQueue = ko.computed(function () {
            return gameData.Games().length > 1;
        });
        this.NextGamesCount = ko.computed<string>(function () {
            var numberOfGames: number = gameData.Games().length-1;
            if (numberOfGames > 5)
                return "5";
            else if (numberOfGames > 1)
                return "" + numberOfGames;
            else if (numberOfGames == 1)
                return "";
        })
    }
    RemoveGame = function($data){
        new SocketService().RemoveGame($data._id);
    }
}

export =QueueView;
