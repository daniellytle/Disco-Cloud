/**
 * Created by Daniel on 8/22/2014.
 */
angular.module('RoomCtrl',[]).controller('RoomController', function($location, $scope ,$http, Room, User, socket, notify, ngAudio) {

    $scope.roomName = $location.path().split("/")[1];

// TEMP LOAD
    $scope.load = function(url)
    {
        $scope.sound = ngAudio.load(url + '?client_id=YOUR_CLIENT_ID');
    }

// Play Music
    socket.on('play', function(time) {

        var now = new Date().getMilliseconds();
        var wait = now - time;
        setTimeout(function(){
            $scope.sound.play();
        },2000 - wait);
    });

    socket.on('load', function(data) {
        socket.emit('start',data);
    });

    $scope.loadIt = function(iteration, time) {
        $scope.sound = ngAudio.load($scope.currentRoom.users[iteration].songURL + '?client_id=YOUR_CLIENT_ID');
        $scope.sound.start = time;
    }

    var iterate = function() {
        $scope.iter = (++$scope.iter) % $scope.currentRoom.users.length;
    }

    var play = function(iteration, time) {
        if ($scope.currentRoom.users[iteration].songURL != '') {
            $scope.sound = ngAudio.load($scope.currentRoom.users[iteration].songURL + '?client_id=YOUR_CLIENT_ID');
            $scope.sound.play();
            $scope.check = true;
        }
        else {
            iterate();
            play($scope.iter);
            $scope.check = true;
        }
    }


    $scope.start = function() {

        $scope.sound.play();

        //socket.emit('start',$scope.currentRoom.roomName);
    };

    socket.emit('joinGroup',{ roomName:$scope.roomName, userName:new Date().getMilliseconds()});

    socket.on('joined', function() {
        $http.get("/api/room/" + $location.path().split("/")[1])
            .success(function(data) {
                $scope.currentRoom = data;
                console.log(data);
            })
            .error(function(err) {
                console.log(err);
            });
        socket.emit('enter',{});
    })

//  User Join ===========================================

    socket.on('roomChange',function(data) {
        console.log("caught Change " + data);
        $scope.message = data;
        notify.run;
        setTimeout(function() {
            $scope.message = "";
        }, 2000);

        $http.get("/api/room/" + $location.path().split("/")[1])
            .success(function(data) {
                $scope.currentRoom = data;
                console.log(data);
            })
            .error(function(err) {
                console.log(err);
            });
    });

    socket.on('left', function(data) {
        alert(data.userName + ' left!');
        $http.get("/api/room/" + $location.path().split("/")[1])
            .success(function(data) {
                $scope.currentRoom = data;
                console.log(data);
            })
            .error(function(err) {
                console.log(err);
            });
    })

    $scope.search = function() {
        $scope.player.get('/tracks', { q: $scope.searchQuery, limit:20}, function(tracks) {
            $scope.$apply(function() {
                $scope.searchResults = tracks;
            });

            console.log(tracks);
        });
    }

    $scope.emit = function (url) {
        $scope.sound = ngAudio.load(url);
        $scope.sound.play();
    }

// SCRIPT LOADING ==========================================

    function loadScript(url, callback)
    {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

    var Initialize = function() {

        SC.initialize({
            client_id: 'YOUR_CLIENT_ID'
        });

        $scope.player = SC;
    };

    loadScript("http://connect.soundcloud.com/sdk.js", Initialize);


});