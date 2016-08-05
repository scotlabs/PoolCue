import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../../datamodels/eventTypes');
import Player = require('../../datamodels/player');
import gameData = require('../../datamodels/gameData');
import SocketService = require('../../services/socketservice');

class LeaderboardView {

    HasPlayers:KnockoutComputed<boolean>;
    PlayerData:gameData;
    socketService:SocketService;
    constructor() {
        this.socketService = new SocketService();
        this.PlayerData = gameData.Players;
        this.HasPlayers = ko.computed(function(){
            return gameData.Players().length>0;
        });
        
    }
    
    IsLiberated = function(data): boolean{
        return data.liberated || false;
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