import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../../datamodels/eventTypes');
import Player = require('../../datamodels/player');
import gamedata = require('../../datamodels/gamedata');
import SocketService = require('../../services/socketservice');

class LeaderboardView {

    HasPlayers:KnockoutComputed<boolean>;
    PlayerData:gamedata;
    socketService:SocketService;
    constructor() {
        this.socketService = new SocketService();
        this.PlayerData = gamedata.Players;
        this.HasPlayers = ko.computed(function(){
            return gamedata.Players().length>0;
        });
        
    }
    
    PlayerDelta = function(player) : number {
        return (player.wins*1 - player.losses*1);
    }   
    
    PlayerDeltaDesc = function(player) : string {
        var $delta:number = this.PlayerDelta(player);
        if ($delta > 0) {
            return '+ ' + $delta;
        } else if ($delta < 0) {
            return '- ' + Math.abs($delta);
        } else {
            return '0';
        }
    }

    PlayerDeltaCss = function(player) : string {
        var $delta:number = this.PlayerDelta(player);
        if ($delta > 0) {
            return 'bg-success';
        } else if ($delta < 0) {
            return 'bg-warning';
        } else {
            return '';
        }
    }

    GetStats = function(data){
        new SocketService().GetStats(data.name);
    }
}

export =LeaderboardView;