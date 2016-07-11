import app = require('durandal/app');
import ko = require('knockout');
import eventTypes = require('../../datamodels/eventTypes');
import gamedata = require('../../datamodels/gamedata');
import Player = require('../../datamodels/player');
import SocketService = require('../../services/socketservice');

class WaitingListViewModel {
    public HasWaiting: KnockoutComputed<boolean>;
    public CanAddToWaitingList: KnockoutComputed<boolean>;
    public CanPlay: KnockoutComputed<boolean>;
    public FilteredList: KnockoutComputed<any>;
    public WaitingList: KnockoutObservableArray<Player>;
    PlayerName: KnockoutObservable<string>;
    socketService: SocketService;

    machine1: any;
    machine2: any;
    Spin_Player1: KnockoutObservable<string>;
    Spin_Player2: KnockoutObservable<string>;

    /**
   *
   */
    stringStartsWith = function (string, startsWith) {          
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };
    constructor() {
        var _this = this;
        this.socketService = new SocketService();
        this.WaitingList = gamedata.PlayersWaiting;
        this.WaitingList.subscribe(function (newData) {
            _this.KillSlots();
            _this.SetSlots();
        });
        this.HasWaiting = ko.computed(function () {
            return gamedata.PlayersWaiting().length > 0;
        });
        this.PlayerName = ko.observable<string>('');
        this.Spin_Player1 = ko.observable<string>('');
        this.Spin_Player2 = ko.observable<string>('');
        this.FilteredList = ko.computed<any>(function() {
            var filter = _this.Spin_Player1();
            if (!filter) {
                return _this.WaitingList().slice(1);
            } else {
                return ko.utils.arrayFilter(_this.WaitingList(), function(item) {
                    return !(item.player.toLowerCase()=== filter.toLowerCase());
                });
            }
        }, this);
        
        this.CanAddToWaitingList = ko.computed<boolean>({
            owner: this,
            read: () => {
                return _this.PlayerName() != null;
            }
        });
        this.CanPlay = ko.computed<boolean>({
            owner: this,
            read: () => {
                return _this.Spin_Player1() != '' && _this.Spin_Player2() != '' && _this.Spin_Player1() != _this.Spin_Player2();
            }
        });
    };
    compositionComplete = function () {
        this.SetSlots();
    }

    SetSlots = function () {

    }

    detached = function () {
        this.KillSlots();
    }
    KillSlots = function () {
        if (this.machine1)
            this.machine1.destroy();
        if (this.machine2)
            this.machine2.destroy();
    }

    AddToWaitingList = function () {
        if (!this.CanAddToWaitingList()) {
            return;
        }
        this.socketService.AddToWaitingList(this.PlayerName());
        this.PlayerName('');
    }

    Spin = function () {

        var __this = this;
        __this.Spin_Player1('');
        __this.Spin_Player2('');
        this.machine1 = $("#machine1").slotMachine({
            active: 0,
            delay: 500
        });
        this.machine1.shuffle(5, () => {
            __this.Spin_Player1(this.WaitingList()[this.machine1.active].player);
            __this.machine2 = $("#machine2").slotMachine({
                active: 1,
                delay: 500,
                direction: 'down'
            });
            __this.machine2.shuffle(5, () => {
                __this.Spin_Player2(this.WaitingList()[this.machine2.active].player);
            });
        });
    }

    Play = function () {
        this.socketService.CreateGameFromWaitingList(this.Spin_Player1(), this.Spin_Player2());
        this.Spin_Player1('');
        this.Spin_Player2('');
    }
}
export = WaitingListViewModel;