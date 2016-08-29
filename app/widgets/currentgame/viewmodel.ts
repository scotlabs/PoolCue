import app = require('durandal/app');
import ko = require('knockout');
import Player = require('../datamodels/player');
import eventtypes = require('../../datamodels/eventTypes');
import gameData = require('../../datamodels/gameData');
import SocketService = require('../../services/socketservice');
import SecurityService = require('../../services/security');

class ViewModel {
    HasGame: KnockoutObservable<boolean>;
    CanSetWinner: KnockoutObservable<boolean>;
    CanPlayWinner: KnockoutObservable<boolean>;
    Player1: KnockoutObservable<Player>;
    Player2: KnockoutObservable<Player>;
    Game: any;
    _this: any;
    socketService: SocketService;
    security: SecurityService;

    constructor() {
        var _this = this;
        this.security = new SecurityService();
        this.socketService = new SocketService();
        this.Player1 = ko.observable<Player>();
        this.Player2 = ko.observable<Player>();
        this.HasGame = ko.observable<boolean>(false);
        this.CanSetWinner = ko.observable<boolean>(true);
        this.CanPlayWinner = ko.observable<boolean>(false);
    }

    attached = function () {
        var _this = this;
        gameData.Games.subscribe(function (eventData) {
            _this.Game = eventData[0];
            _this.setGame();
        });
    };
    activate = function () {

    };
    compositioncomplete = function () {
        if (gameData.Games() && gameData.Games()[0]) {
            this.Game = gameData.Games()[0];
            this.setGame();
        }
    };
    setGame() {
        if (!this.Game) {
            this.Player1(null);
            this.Player2(null);
            this.HasGame(false);
            this.CanSetWinner(true);
            this.CanPlayWinner(false);
            return;
        }
        this.Player1(this.Game.player1);
        this.Player2(this.Game.player2);
        this.HasGame(this.Game._id != null);
        this.CanPlayWinner((this.Game.Player1 != this.security.GetUser() &&
                            this.Game.Player2 != this.security.GetUser() &&
                            this.Game.childGameId == undefined));
    }
    setWinner(data) {
        var player = ko.unwrap(data);
        var confirmed = confirm(player + " won this game?");
        if (!confirmed) {
            return;
        }
        this.CanSetWinner(false);
        this.CanPlayWinner(false);
        this.socketService.SetWinner(this.Game._id, player);
    }
    AbandonCurrentGame() {
        if (confirm("Are you sure?")) {
            this.socketService.RemoveGame(this.Game._id);
        }
    }
    PlayWinner() {
      if (confirm("Play winner?")){
        this.CanPlayWinner(false);
        this.socketService.PlayWinner(this.security.GetUser(), this.Game._id);
      }
    }
}

export = ViewModel;
