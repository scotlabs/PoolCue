import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../datamodels/eventTypes');
import Player = require('../datamodels/player');
import gameData = require('../datamodels/gameData');

class LeaderboardView {

    public HasPlayers:KnockoutComputed<boolean>;
    public PlayerData:gameData;
    constructor() {
        var _this = this;
        this.PlayerData = gameData.Players;
        _this.HasPlayers = ko.computed(function(){
            return gameData.Players().length>0;
        });
    }
    
}

export =LeaderboardView;