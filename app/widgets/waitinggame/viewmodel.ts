import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../../datamodels/eventTypes');
import gamedata = require('../../datamodels/gamedata');
import Player = require('../../datamodels/player');

class ViewModel{
    HasWaiting: KnockoutObservable<boolean>;
    /**
     *
     */
    constructor() {
         this.HasWaiting = ko.computed(function(){
            return gamedata.PlayersWaiting().length > 1;
        });
    }
    activate= function() {
       
    };
}
export = ViewModel;