/// <reference path="../../typings/globals/durandal/index.d.ts" />
import system = require('durandal/system');
import http = require('plugins/http');
class DataProvider {
    Model: any = null;
    Configuration: any = null;
    public Load()  {
        var _this = this;
        return http.get('/api/asd')
            .then(function (cfg) {
                _this.Model = cfg;
            });
    }
    public LoadConfiguration(){
        var _this = this;
        return http.get('/api/configuration')
            .then(function (cfg) {
                _this.Configuration = cfg;
            });
    }
}
export =DataProvider;
