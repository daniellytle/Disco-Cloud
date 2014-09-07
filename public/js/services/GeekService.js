/**
 * Created by Daniel on 8/22/2014.
 */
angular.module('GeekService', []).factory('Geek', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/geeks');
        },

        getID : function(id) {
            return $http.get('/api/geeks/'+ id);
        },

        // call to POST and create a new geek
        create : function(geekData) {
            return $http.post('/api/geeks', geekData);
        },

        // call to DELETE a geek
        delete : function(id) {
            return $http.delete('/api/geeks/' + id);
        }
    }

}]);