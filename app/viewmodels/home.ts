import app = require('durandal/app');
import ko = require('knockout');
class Home {

    constructor() {

    }
    public name : KnockoutObservable<any>;
    public sayHello = function() {
       app.showMessage('Hesllo ' + this.name() + '! Nice to meet you.', 'Greetings');
    }
    activate = function () {
        
    };
    attached = function () {
       
    }
}

export =Home;