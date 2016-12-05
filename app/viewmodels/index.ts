import gameData = require('../datamodels/gameData');
import SecurityService = require('../services/security');
import SocketService = require('../services/socketservice');
import router = require('plugins/router');

class IndexViewModel {
    HasQueue: KnockoutObservable<boolean>;
    HasWaiting: KnockoutObservable<boolean>;
    security: SecurityService;
    sockets: SocketService;
    PlayerName: KnockoutObservable<string>;
    /**
     *
     */
    constructor() {
        this.security = new SecurityService();
        this.sockets = new SocketService();
        this.HasQueue = ko.computed(function () {
            return gameData.Games().length > 1;
        });
        this.HasWaiting = ko.computed(function () {
            return gameData.PlayersWaiting().length > 1;
        });
        this.PlayerName = this.security.PlayerName;
    }
    canActivate = function (): any | boolean {
        if (!this.security.IsAuthenticated()) {
            return { redirect: 'login' };
        }
        return true;
    }
    attached = function () {
        this.sockets.Refresh();
    }
    SignOut() {
        router.navigate("signout");
    }
}
export = IndexViewModel;
