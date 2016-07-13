import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../../datamodels/eventTypes');
import Player = require('../../datamodels/player');
import gameData = require('../../datamodels/gameData');
import Game = require('../../datamodels/game');

class QueueView {

    HasQueue: KnockoutComputed<boolean>;
    GamesData: KnockoutObservableArray<Game>;
    NextGamesCount: KnockoutComputed<string>;
    constructor() {
        var _this = this;
        this.GamesData = gameData.Games;
        this.HasQueue = ko.computed(function () {
            return gameData.Games().length > 1;
        });
        this.NextGamesCount = ko.computed<string>(function () {
            var numberOfGames: number = gameData.Games().length;
            if (numberOfGames > 5)
                return "5";
            else if (numberOfGames > 1)
                return "" + numberOfGames;
            else if (numberOfGames == 1)
                return "";
        })
    }

}

export =QueueView;