import app = require('durandal/app');
import ko = require('knockout');
import Game = require('../../datamodels/game');
import eventtypes = require('../../datamodels/eventTypes');
import gameData = require('../../datamodels/gameData');
import SocketService = require('../../services/socketservice');
import SecurityService = require('../../services/security');

class ViewModel {
    HasGame: KnockoutObservable<boolean>;
    CanSetWinner: KnockoutObservable<boolean>;
    CanPlayWinner: KnockoutObservable<boolean>;
    Player1: KnockoutObservable<string>;
    Player2: KnockoutObservable<string>;
    Game: KnockoutObservable<Game>;
    _this: any;
    socketService: SocketService;
    security: SecurityService;

    constructor() {
        var _this = this;
        this.security = new SecurityService();
        this.socketService = new SocketService();
        this.Game = ko.observable<Game>(null);
        this.Player1 = ko.observable<string>();
        this.Player2 = ko.observable<string>();
        this.HasGame = ko.computed<boolean>(function(){
            var game = ko.unwrap(this.Game);
            if (game){
                return game._id != null;
            }
            return false;

        }, this);
        this.CanSetWinner = ko.observable<boolean>(true);
        this.CanPlayWinner = ko.computed<boolean>(function(){
            var game = ko.unwrap(this.Game);
            if (!ko.unwrap(this.HasGame)){
                return false;
            }
            return  ko.unwrap(game.player1) != this.security.GetUser() &&
                    ko.unwrap(game.player2) != this.security.GetUser() &&
                    game.childGameId == undefined;
        }, this);
    }

    attached = function () {
        var _this = this;
        gameData.Games.subscribe(function (eventData) {
            _this.Game(eventData[0]);
            _this.setGame();
        });
    };
    activate = function () {

    };
    compositioncomplete = function () {
        if (gameData.Games() && gameData.Games()[0]) {
            this.Game(gameData.Games()[0]);
            this.setGame();
        }
    };
    setGame() {
        if (!this.Game) {
            this.Player1(null);
            this.Player2(null);
            this.CanSetWinner(true);
            this.CanPlayWinner(false);
            return;
        }
        var game:Game = this.Game();
        this.Player1(game.player1);
        this.Player2(game.player2);
        this.HasGame();
        this.CanSetWinner(true);
    }
    setWinner(data) {
        var player = ko.unwrap(data);
        var game = ko.unwrap(this.Game);
        var confirmed = confirm(player + " won this game?");
        if (!confirmed) {
            return;
        }
        this.CanSetWinner(false);
        this.socketService.SetWinner(game._id, player);
    }
    AbandonCurrentGame() {
        if (confirm("Are you sure?")) {
            this.socketService.RemoveGame(ko.unwrap(this.Game)._id);
        }
    }
    PlayWinner() {
      if (confirm("Play winner?")){
        this.socketService.PlayWinner(this.security.GetUser(), ko.unwrap(this.Game)._id);
      }
    }
}

export = ViewModel;
