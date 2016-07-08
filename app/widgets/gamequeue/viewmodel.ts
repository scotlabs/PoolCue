import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../../datamodels/eventTypes');
import Player = require('../../datamodels/player');
import gamedata = require('../../datamodels/gamedata');
import Game = require('../../datamodels/game');

class QueueView {

    public HasQueue:KnockoutComputed<boolean>;
    public GamesData:KnockoutObservableArray<Game>;
    constructor() {
        var _this = this;
        this.GamesData = gamedata.Games;
        _this.HasQueue = ko.computed(function(){
            return gamedata.Games().length > 1;
        });
    }
    
}

export =QueueView;