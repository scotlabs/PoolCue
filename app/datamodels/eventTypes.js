define(["require", "exports"], function (require, exports) {
    "use strict";
    var EventTypes = (function () {
        function EventTypes() {
        }
        Object.defineProperty(EventTypes, "PlayerDataUpdate", {
            get: function () { return "PlayerDataUpdate"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventTypes, "GamesDataUpdate", {
            get: function () { return "GamesDataUpdate"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EventTypes, "StatsDataUpdate", {
            get: function () { return "StatsDataUpdate"; },
            enumerable: true,
            configurable: true
        });
        return EventTypes;
    }());
    return EventTypes;
});
//# sourceMappingURL=eventTypes.js.map