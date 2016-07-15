import gameData = require('../datamodels/gameData');
import SecurityService = require('../services/security');
import router = require('plugins/router');

class AccountViewModel {
    PlayerName: KnockoutObservable<string>;
    PlayerData: gameData;
    security: SecurityService;
    CanSignIn:KnockoutComputed<boolean>;

    constructor() {
        var _this = this;
        this.PlayerName = ko.observable<string>();
        this.PlayerData = gameData.Players;
        this.security = new SecurityService();
        this.CanSignIn = ko.computed(function(){
            return _this.PlayerName() && _this.PlayerName()!='';
        });
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