define(["require", "exports"], function (require, exports) {
    "use strict";
    var SharedDataModel = (function () {
        function SharedDataModel() {
            if (!SharedDataModel.singleton) {
                SharedDataModel.singleton = this;
            }
            return SharedDataModel.singleton;
        }
        SharedDataModel.prototype.someMethod = function () { };
        return SharedDataModel;
    }());
    return SharedDataModel;
});
//# sourceMappingURL=sharedModel.js.map