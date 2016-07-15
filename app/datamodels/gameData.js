define(["require", "exports"], function (require, exports) {
    "use strict";
    var GameData = (function () {
        function GameData() {
        }
        GameData.Games = ko.observableArray();
        GameData.Players = ko.observableArray();
        GameData.PlayersWaiting = ko.observableArray();
        return GameData;
    }());
    return GameData;
});
//# sourceMappingURL=gameData.js.map