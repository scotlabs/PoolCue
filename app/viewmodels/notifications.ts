import router = require('plugins/router');
import SecurityService = require('../services/security');
import SocketService = require('../services/socketservice');
import http = require('plugins/http');

class ViewModel{
    security: SecurityService;
    PlayerName: KnockoutObservable<string>;
    MobileNumber: KnockoutObservable<string>;
    socketService:SocketService;

    constructor() {
        this.socketService = new SocketService();
        this.security = new SecurityService();
        this.PlayerName = this.security.PlayerName;
        this.MobileNumber = ko.observable<string>();
    }
    canActivate = function (): any | boolean {
        if (!this.security.IsAuthenticated()) {
            return { redirect: 'login' };
        }
        return true;
    }
    activate= function() {
        var _this = this;
           http.get('/api/player/' + this.PlayerName(), null, {}).then(
         function (response) {
             if (response==null || response.length != 1)
                return;
             var data = response[0];
            _this.MobileNumber(data.mobile_number);
         },
         function (error) {
            alert(error);
         });
    };
   
    Save(){
        this.socketService.UpdatePlayer(this.security.PlayerName(),this.MobileNumber());

    }
    SignOut() {
        router.navigate("signout");
    }
}
export = ViewModel;