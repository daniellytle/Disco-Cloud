/**
 * Created by Daniel on 8/25/2014.
 */
angular.module("DynamicSizing", []).directive('resize', function ($window) {

    return {
        link: function postLink(scope, element, attrs) {

            scope.onResizeFunction = function(attrs) {
               var top = $('.table').scrollTop();
               var full = $window.innerHeight;
               $('.table').css({"height":(full - top - attrs.resize) + 'px'});
               $('.chatWrap').css({"height":(full - 100) + 'px'});
            };

            // Call to the function when the page is first loaded
            scope.onResizeFunction(attrs);

            angular.element($window).bind('resize', function() {
                scope.onResizeFunction(attrs);
                scope.$apply();
            });
        }
    };
});

