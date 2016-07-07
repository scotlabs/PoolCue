define(["require", "exports", 'durandal/composition'], function (require, exports, composition) {
    "use strict";
    var ViewModel = (function () {
        function ViewModel() {
            this.activate = function () {
            };
            this.getHeaderText = function (item) {
                if (this.settings.headerProperty) {
                    return item[this.settings.headerProperty];
                }
                return item.toString();
            };
            this.afterRenderItem = function (elements, item) {
                var parts = composition.getParts(elements);
                var $itemContainer = $(parts.itemContainer);
                $itemContainer.hide();
                $(parts.headerContainer).bind('click', function () {
                    $itemContainer.toggle('fast');
                });
            };
        }
        return ViewModel;
    }());
    return ViewModel;
});
//# sourceMappingURL=viewmodel.js.map