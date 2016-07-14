import gameData = require('../datamodels/gameData');
import SecurityService = require('../services/security');

class IndexViewModel {
    HasQueue: KnockoutObservable<boolean>;
    HasWaiting: KnockoutObservable<boolean>;
    security:SecurityService;
    /**
     *
     */
    constructor() {
        this.security = new SecurityService();
        this.HasQueue = ko.computed(function () {
            return gameData.Games().length > 1;
        });
        this.HasWaiting = ko.computed(function () {
            return gameData.PlayersWaiting().length > 1;
        });
    }
    canActivate = function() : any | boolean {
        if (!this.security.IsAuthenticated()) {
            return {redirect: 'login'};
        }
        return true;
    }
    attached = function(){
    }
}
export = IndexViewModel;