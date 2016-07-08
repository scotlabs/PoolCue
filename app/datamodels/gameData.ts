import Game = require('./game');
import Player = require('./player');
class GameData {
    static Games : KnockoutObservableArray<Game> = ko.observableArray<Game>(); 
    static Players : KnockoutObservableArray<Player> = ko.observableArray<Player>(); 
    static PlayersWaiting : KnockoutObservableArray<Player> = ko.observableArray<Player>(); 
    constructor() {
    }
}
export = GameData;