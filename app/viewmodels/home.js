define(["require", "exports", 'durandal/app'], function (require, exports, app) {
    "use strict";
    var Home = (function () {
        function Home() {
            this.sayHello = function () {
                app.showMessage('Hesllo ' + this.name() + '! Nice to meet you.', 'Greetings');
            };
            this.activate = function () {
            };
            this.attached = function () {
            };
        }
        return Home;
    }());
    return Home;
});
//# sourceMappingURL=home.js.map