/**
 * Created by Daniel on 10/16/2014.
 */
angular.module('Filters', []).filter('array', function() {
    return function(items) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        return filtered;
    };
});