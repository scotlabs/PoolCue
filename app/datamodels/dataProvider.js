define(["require", "exports", 'plugins/http'], function (require, exports, http) {
    "use strict";
    var DataProvider = (function () {
        function DataProvider() {
            this.Model = null;
            this.Configuration = null;
        }
        DataProvider.prototype.Load = function () {
            var _this = this;
            return http.get('/api/asd')
                .then(function (cfg) {
                _this.Model = cfg;
            });
        };
        DataProvider.prototype.LoadConfiguration = function () {
            var _this = this;
            return http.get('/api/configuration')
                .then(function (cfg) {
                _this.Configuration = cfg;
            });
        };
        return DataProvider;
    }());
    return DataProvider;
});
//# sourceMappingURL=dataProvider.js.map