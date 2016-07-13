import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../../datamodels/eventTypes');
import Player = require('../../datamodels/player');
import gameData = require('../../datamodels/gameData');
import Game = require('../../datamodels/game');
import SocketService = require('../../services/socketservice');

class QueueView {

    HasQueue: KnockoutComputed<boolean>;
    GamesData: KnockoutObservableArray<Game>;
    NextGamesCount: KnockoutComputed<string>;
    socketService:SocketService;

    constructor() {
        var _this = this;
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