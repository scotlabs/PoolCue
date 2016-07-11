define(["require", "exports", 'knockout', '../../datamodels/gamedata', '../../services/socketservice'], function (require, exports, ko, gamedata, SocketService) {
    "use strict";
    var WaitingListViewModel = (function () {
        function WaitingListViewModel() {
            /**
           *
           */
            this.stringStartsWith = function (string, startsWith) {
                string = string || "";
                if (startsWith.length > string.length)
                    return false;
                return string.substring(0, startsWith.length) === startsWith;
            };
            this.compositionComplete = function () {
                this.SetSlots();
            };
            this.SetSlots = function () {
            };
            this.detached = function () {
                this.KillSlots();
            };
            this.KillSlots = function () {
                if (this.machine1)
                    this.machine1.destroy();
                if (this.machine2)
                    this.machine2.destroy();
            };
            this.AddToWaitingList = function () {
                if (!this.CanAddToWaitingList()) {
                    return;
                }
                this.socketService.AddToWaitingList(this.PlayerName());
                this.PlayerName('');
            };
            this.Spin = function () {
                var _this = this;
                var __this = this;
                __this.Spin_Player1('');
                __this.Spin_Player2('');
                this.machine1 = $("#machine1").slotMachine({
                    active: 0,
                    delay: 500
                });
                this.machine1.shuffle(5, function () {
                    __this.Spin_Player1(_this.WaitingList()[_this.machine1.active].player);
                    __this.machine2 = $("#machine2").slotMachine({
                        active: 1,
                        delay: 500,
                        direction: 'down'
                    });
                    __this.machine2.shuffle(5, function () {
                        __this.Spin_Player2(_this.WaitingList()[_this.machine2.active].player);
                    });
                });
            };
            this.Play = function () {
                this.socketService.CreateGameFromWaitingList(this.Spin_Player1(), this.Spin_Player2());
                this.Spin_Player1('');
                this.Spin_Player2('');
            };
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
            this.PlayerName = ko.observable('');
            this.Spin_Player1 = ko.observable('');
            this.Spin_Player2 = ko.observable('');
            this.FilteredList = ko.computed(function () {
                var filter = _this.Spin_Player1();
                if (!filter) {
                    return _this.WaitingList().slice(1);
                }
                else {
                    return ko.utils.arrayFilter(_this.WaitingList(), function (item) {
                        return !(item.player.toLowerCase() === filter.toLowerCase());
                    });
                }
            }, this);
            this.CanAddToWaitingList = ko.computed({
                owner: this,
                read: function () {
                    return _this.PlayerName() != null;
                }
            });
            this.CanPlay = ko.computed({
                owner: this,
                read: function () {
                    return _this.Spin_Player1() != '' && _this.Spin_Player2() != '' && _this.Spin_Player1() != _this.Spin_Player2();
                }
            });
        }
        ;
        return WaitingListViewModel;
    }());
    return WaitingListViewModel;
});
//# sourceMappingURL=viewmodel.js.map