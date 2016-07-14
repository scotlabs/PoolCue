/// <reference path="../../typings/globals/amplifyjs/index.d.ts" />
import amplify = require('amplify');

class SecurityService {
    public PlayerName: KnockoutObservable<string>;
    constructor() {
        this.PlayerName = ko.observable<string>();
    }
    IsAuthenticated = function (): boolean {
        return this.GetUser() != null;
    }
    SignIn = function (username: string): boolean {
        this.StoreUser(username);
        return true;
    }
    SignOut = function (): boolean {
        this.StoreUser(null);
        return true;
    }
    GetUser = function () {
        var name = amplify.store("UserKey");
        this.PlayerName(name);
        return name;
    }
    StoreUser = function (username: string) {
        var userDetail = amplify.store("UserKey", username);
        return userDetail;
    }
}
export = SecurityService;