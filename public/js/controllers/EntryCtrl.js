/**
 * Created by Daniel on 8/22/2014.
 *  - Handles the entry page of DiscoCloud
 */
angular.module('EntryCtrl', []).controller('EntryController', function($scope, $http, $location, socket) {

    // ==== Entry Controller ==== //
    $scope.query   = "";
    $scope.results = {};

    // reload all room data
    $scope.loadRooms = function() {
        $http.get("/api/all")
            .success(function(data) {
                console.log(data);
                $scope.results = data;
            })
            .error(function(err) {
                console.log(err);
            })
    };
    // Init load
    $scope.loadRooms();

    // enter an existing room
    $scope.enterRoom = function(name) {
        $location.path("/" + name);
    };

    // create a new room and enter
    $scope.createRoom = function(rmNm) {
        if (!rmNm) {
            alert('Please Enter a Room Name');
        } else {
            $http.post("api/room/" + rmNm, {})
                .success(function (data) {
                    console.log(data);
                    $scope.enterRoom(rmNm);
                })
                .error(function (err) {
                    console.log(err);
                })
        }
    };

    // ==== Socket Events ==== //

    // room data change event
    socket.on('totalChange', function() {
        $scope.loadRooms();
    });

    // current users change
    socket.on('new', function(data) {
        $scope.userCount = data;
    });

    // ==== Filter Utility ==== //

    // filters repeat by query text
    $scope.search = function (item){
        return item.name.toLowerCase().indexOf($scope.query.toLowerCase()) > -1;
    };

});