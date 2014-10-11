angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {


    $routeProvider
        // home page
        // nerds page that will use the EntryController
        .when('/', {
            templateUrl: 'views/entry.html',
            controller: 'EntryController'
        })

        //
        .when('/:name', {
            templateUrl: 'views/room.html',
            controller: 'RoomController'
        });

    $locationProvider.html5Mode(true);

}]);