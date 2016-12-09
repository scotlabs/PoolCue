import gameData = require('../datamodels/gameData');
import Player = require('../datamodels/player');
import Game = require('../datamodels/game');

class ScreenViewModel {
    HasGame: KnockoutObservable<boolean>;
    HasQueue: KnockoutObservable<boolean>;
    HasWaiting: KnockoutObservable<boolean>;
    Game: any = null;
    Player1: KnockoutObservable<Player>;
    Player2: KnockoutObservable<Player>;
    HasPlayers:KnockoutComputed<boolean>;
    NextGamesCount: KnockoutComputed<string>;
    GamesData: KnockoutObservableArray<Game>;
    WaitingList: KnockoutObservableArray<Player>;
    PlayerData:gameData;

    /**
     *
     */
    constructor() {
        var _this = this;
        this.HasGame = ko.observable<boolean>(false);
        this.HasQueue = ko.computed(function () {
            return gameData.Games().length > 1;
        });
        this.HasWaiting = ko.computed(function () {
            return gameData.PlayersWaiting().length > 0;
        });
        this.Player1 = ko.observable<Player>();
        this.Player2 = ko.observable<Player>();
        this.HasPlayers = ko.computed(function(){
            return gameData.Players().length>0;
        });
        this.GamesData = gameData.Games;
        this.WaitingList = gameData.PlayersWaiting;
        this.PlayerData = gameData.Players;
        this.NextGamesCount = ko.computed<string>(function () {
            var numberOfGames: number = gameData.Games().length - 1;
            if (numberOfGames > 5)
                return "5";
            else if (numberOfGames > 1)
                return "" + numberOfGames;
            else if (numberOfGames === 1)
                return "";
        })
        gameData.Games.subscribe(function (eventData) {
            _this.Game = eventData[0];
            _this.setGame();
        });
    }
    attached = function () {

    }
    compositioncomplete = function () {
        if (gameData.Games() && gameData.Games()[0]) {
            this.Game = gameData.Games()[0];
            this.setGame();
        }
    };
    setGame = function () {
        if (!this.Game) {
            this.Player1(null);
            this.Player2(null);
            this.HasGame(false);
            return;
        }
        this.Player1(this.Game.player1);
        this.Player2(this.Game.player2);
        this.HasGame(this.Game._id !== null);
    }
}
export = ScreenViewModel;