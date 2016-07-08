define(["require", "exports", 'knockout', '../../datamodels/gamedata'], function (require, exports, ko, gamedata) {
    "use strict";
    var ViewModel = (function () {
        /**
         *
         */
        function ViewModel() {
            this.activate = function () {
            };
            this.HasWaiting = ko.computed(function () {
                return gamedata.PlayersWaiting().length > 1;
            });
        }
        return ViewModel;
    }());
    return ViewModel;
});
//# sourceMappingURL=viewmodel.js.map