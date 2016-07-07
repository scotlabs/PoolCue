
import composition = require('durandal/composition');

class ViewModel{
    activate= function() {
       
    };
    getHeaderText = function(item) {
        if (this.settings.headerProperty) {
            return item[this.settings.headerProperty];
        }
 
        return item.toString();
    };
    afterRenderItem = function(elements, item) {
        var parts = composition.getParts(elements);
        var $itemContainer = $(parts.itemContainer);
 
        $itemContainer.hide();
 
        $(parts.headerContainer).bind('click', function() {
            $itemContainer.toggle('fast');
        });
    };
}
export = ViewModel;