define(["require", "exports", 'knockout', '../../datamodels/gamedata'], function (require, exports, ko, gamedata) {
    "use strict";
    var QueueView = (function () {
        function QueueView() {
            var _this = this;
            this.GamesData = gamedata.Games;
            _this.HasQueue = ko.computed(function () {
                return gamedata.Games().length > 1;
            });
        }
        return QueueView;
    }());
    return QueueView;
});
//# sourceMappingURL=viewmodel.js.map