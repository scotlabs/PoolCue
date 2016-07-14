import SecurityService = require('../services/security');
import router = require('plugins/router');

class ViewModel{
    sec:SecurityService;

    activate= function() {
       new SecurityService().SignOut();
       router.navigate("");
    };
   
}
export = ViewModel;