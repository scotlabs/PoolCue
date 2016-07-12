
import SocketService = require('../../services/socketservice');
import app = require('durandal/app');
import gamedata = require('../../datamodels/gamedata');

class ManualAddViewModel {

    CanAddManualGame: KnockoutComputed<boolean>;
    Player1Name: KnockoutObservable<string>;
    Player2Name: KnockoutObservable<string>;
    socketService:SocketService;
    PlayerData:gamedata;   

    constructor() {
        var _this = this;
        this.socketService = new SocketService();
        this.Player1Name = ko.observable<string>('');
        this.Player2Name = ko.observable<string>('');
        this.CanAddManualGame = ko.computed<boolean>({
            owner: this,
            read: () => {
                return _this.Player1Name().length > 0 && _this.Player2Name().length > 0;
            }
        });
        this.PlayerData = gamedata.Players;
    }

    activate = function () {
    };


    AddManualGame = function () {
        if (!this.CanAddManualGame()){
            return;
        }
        this.socketService.CreateGame(this.Player1Name(),this.Player2Name());
        this.Player1Name('');
        this.Player2Name('');
    }

}
export = ManualAddViewModel;