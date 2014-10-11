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

    };

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