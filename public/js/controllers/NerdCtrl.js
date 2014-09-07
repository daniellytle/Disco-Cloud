/**
 * Created by Daniel on 8/22/2014.
 */
angular.module('NerdCtrl', []).controller('EntryController', function($scope, $http, $location, User) {


    $scope.formData = {};

    /// ===============================================

    $scope.createRoom = function() {
        var userInfo = $scope.formData;
        $http.post('api/room', userInfo)
            .success(function(data){
                // clear the form so our user is ready to enter another
                $scope.room = data;
                $scope.formData = {};
                $location.path('/soundroom/' + userInfo.roomKey);
                User.Person = data[0].users[data[0].users.length - 1];
                User.Room = data[0];
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }



    $scope.joinRoom = function() {
        var userInfo = $scope.formData;
        $http.post('api/room/' + $scope.formData.roomKey, userInfo)
            .success(function(data){
                // clear the form so our user is ready to enter another

                $scope.room = data;
                $scope.formData = {};
                if(data.length) {
                    $location.path('/soundroom/' + userInfo.roomKey);
                    User.Person = data[0].users[data[0].users.length - 1];
                    User.Room = data[0];
                    console.log(data);
                }
                else {
                    alert("no Room Exists");
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    }

    // OLD JUNKKK ============================================

    // when landing on the page, get all Users and show them

    // when submitting the add form, send the text to the node API
    $scope.createUser = function() {
        $http.post('/api/room', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.users = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteUser = function(id) {
        $http.delete('/api/user/' + id)
            .success(function(data) {
                $scope.users = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


});