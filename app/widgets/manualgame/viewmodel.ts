
import SocketService = require('../../services/socketservice');
import app = require('durandal/app');
import gameData = require('../../datamodels/gameData');
import SecurityService = require('../../services/security');

class ManualAddViewModel {

    Player1Name: KnockoutObservable<string>;
    Player2Name: KnockoutObservable<string>;
    socketService:SocketService;
    PlayerData:gameData;
    security: SecurityService;

    constructor() {
        var _this = this;
        this.socketService = new SocketService();
        this.security = new SecurityService();
        this.Player1Name = ko.observable<string>(this.security.GetUser());
        this.Player2Name = ko.observable<string>();
        this.PlayerData = gameData.Players;
    }

    activate = function () {
    };

    AddManualGame = function () {
        if (!this.Player1Name() || this.Player1Name() === "" || !this.Player2Name() || this.Player2Name() === ""){
            return;
        }
        this.socketService.CreateGame(this.Player1Name(),this.Player2Name());
        this.Player1Name(this.security.GetUser()); //Set Player1Name back to Player's Name
        this.Player2Name('');
    }

}
export = ManualAddViewModel;
