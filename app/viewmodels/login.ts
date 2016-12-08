import gameData = require('../datamodels/gameData');
import SecurityService = require('../services/security');
import router = require('plugins/router');

class AccountViewModel {
    PlayerName: KnockoutObservable<string>;
    PlayerData: gameData;
    security: SecurityService;
    
    constructor() {
        var _this = this;
        this.PlayerName = ko.observable<string>();
        this.PlayerData = gameData.Players;
        this.security = new SecurityService();
    }

    activate = function () {
    }

    LogIn = function () {
        if (!this.PlayerName() || this.PlayerName() == '')
            return;
        var signedIn = this.security.SignIn(this.PlayerName());
        if (signedIn){
            router.navigate("");
        }
    }
}
export = AccountViewModel;
