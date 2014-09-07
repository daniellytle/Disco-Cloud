/**
 * Created by Daniel on 8/24/2014.
 */
/**
 * Created by Daniel on 8/22/2014.
 */
angular.module('RoomService', []).factory('Room', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function(id, callback) {
            return $http.get('/api/room/' + id).
            success(callback).error(callback);
        },

        // call to POST and create a new geek
        create : function(roomKey) {
            return $http.post('/api/room', roomKey);
        },

        // call to DELETE a geek
        delete : function(id) {
            return $http.delete('/api/room/' + id);
        }
    }

}]);