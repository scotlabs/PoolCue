class SharedDataModel
{
    private static singleton: SharedDataModel;
    constructor() {
        if (!SharedDataModel.singleton) {
            SharedDataModel.singleton = this;
            
        }
        return SharedDataModel.singleton;
    }
    someMethod() { }
}
export = SharedDataModel;