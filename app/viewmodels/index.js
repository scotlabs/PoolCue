define(["require", "exports", '../datamodels/gameData'], function (require, exports, gameData) {
    "use strict";
    var IndexViewModel = (function () {
        /**
         *
         */
        function IndexViewModel() {
            this.attached = function () {
            };
            this.HasQueue = ko.computed(function () {
                return gameData.Games().length > 1;
            });
            this.HasWaiting = ko.computed(function () {
                return gameData.PlayersWaiting().length > 1;
            });
        }
        return IndexViewModel;
    }());
    return IndexViewModel;
});
//# sourceMappingURL=index.js.map