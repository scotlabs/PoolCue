import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../datamodels/eventTypes');
import Player = require('../datamodels/player');
import gamedata = require('../datamodels/gamedata');

class LeaderboardView {

    public HasPlayers:KnockoutComputed<boolean>;
    public PlayerData:gamedata;
    constructor() {
        var _this = this;
        this.PlayerData = gamedata.Players;
        _this.HasPlayers = ko.computed(function(){
            return gamedata.Players().length>0;
        });
    }
    
}

export =LeaderboardView;