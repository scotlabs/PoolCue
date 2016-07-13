import gameData = require('../datamodels/gameData');

class IndexViewModel {
    HasQueue: KnockoutObservable<boolean>;
    HasWaiting: KnockoutObservable<boolean>;
    /**
     *
     */
    constructor() {
        this.HasQueue = ko.computed(function () {
            return gameData.Games().length > 1;
        });
        this.HasWaiting = ko.computed(function () {
            return gameData.PlayersWaiting().length > 1;
        });
    }
    attached = function(){

    }
}
export = IndexViewModel;