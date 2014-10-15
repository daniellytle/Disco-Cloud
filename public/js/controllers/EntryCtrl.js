/**
 * Created by Daniel on 8/22/2014.
 */
angular.module('EntryCtrl', []).controller('EntryController', function($scope, $http, $location, User, socket) {

    /// ===============================================

    $http.get("/api/all")
        .success(function(data) {
            console.log(data);
            $scope.results = data;
        })
        .error(function(err) {
            console.log(err)
        });

    $scope.enterRoom = function(name) {
        $location.path("/" + name);
        socket.emit('enter',{});
    };

    $scope.createRoom = function(rmNm) {
        $http.post("api/room/" + rmNm)
            .success(function(data) {
                console.log(data);
                $scope.enterRoom(rmNm);
            })
            .error(function(err) {
                console.log(error);
            })
    };

    socket.on('totalChange', function() {
        $http.get("/api/all")
            .success(function(data) {
                console.log(data);
                $scope.results = data;
            })
            .error(function(err) {
                console.log(err)
            });
    });

    socket.on('new', function(data) {
        $scope.userCount = data;
    })





});