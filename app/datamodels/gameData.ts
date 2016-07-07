class GameData {
    static Games : KnockoutObservableArray<any> = ko.observableArray<any>(); 
    static Players : KnockoutObservableArray<any> = ko.observableArray<any>(); 
    constructor() {
    }
}
export = GameData;