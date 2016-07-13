import app = require('durandal/app');
import ko = require('knockout');
import Player = require('../datamodels/player');
import eventtypes = require('../../datamodels/eventTypes');
import gameData = require('../../datamodels/gameData');
import SocketService = require('../../services/socketservice');

class ViewModel {
    HasGame: KnockoutObservable<boolean>;
    Player1: KnockoutObservable<Player>;
    Player2: KnockoutObservable<Player>;
    Game:any;
    private socketService:SocketService;
    
    constructor() {
        this.socketService = new SocketService();
        this.Player1 = ko.observable<Player>();
        this.Player2 = ko.observable<Player>();
        this.HasGame = ko.observable<boolean>(false);
    }

    attached = function () {
        var _this = this;
        // app.on(eventtypes.GamesDataUpdate).then(function(eventData){
        //     var data = eventData[0];
        //     _this.CurrentGame.Player1(data.player1);
        //     _this.CurrentGame.Player2(data.player2);
        //     _this.CurrentGame.Active = data._id != null;
        // }); 
        gameData.Games.subscribe(function(eventData){
            _this.Game = eventData[0];
            _this.setGame();
        });
        
    };
    activate= function() {
       
    };
    compositioncomplete= function(){
        if (gameData.Games() && gameData.Games()[0]){
            this.Game = gameData.Games()[0];
            this.setGame();
        }
    };
    setGame(){
        if (!this.Game){
            this.Player1(null);
            this.Player2(null);
            this.HasGame(false);
            return;
        }
        this.Player1(this.Game.player1);
        this.Player2(this.Game.player2);
        this.HasGame(this.Game._id != null);
    }
    setWinner(data){
        this.socketService.SetWinner(this.Game._id, ko.unwrap(data))
    }
}

export = ViewModel;
