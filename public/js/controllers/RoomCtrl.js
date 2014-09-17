/**
 * Created by Daniel on 8/22/2014.
 */
angular.module('RoomCtrl',[]).controller('RoomController', function($scope ,$http, Room, User, socket,  ngAudio) {


    // Sound Playing Device ===========================

    $scope.currentRoom = User.Room;
    $scope.iter = 0;

    // Play Music
    socket.on('play', function(time) {
        $scope.loadIt(0,0);
        var now = new Date().getMilliseconds();
        var wait = 2000 - (now - time);
        setTimeout(function(){

            $scope.sound.play();
        }, wait);
    });

    socket.on('load', function(data) {
        socket.emit('start',data);
    });

    socket.on('ping', function() {
        socket.emit('pong');
    })

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
        socket.emit('start',$scope.currentRoom.roomName);
    }

    socket.emit('joinGroup',{
        roomName:User.Room.roomName,
        userName:User.Person.name});

    //  User Join ===========================================

    socket.on('joiner',function(data) {

        $scope.message = data;
        setTimeout(function() {
            $scope.message = "";
        }, 2000);

        Room.get(User.Room.roomName, function(room) {
            $scope.currentRoom = room[0];
        });
    });

    socket.on('leave', function(data) {
        alert(data + ' left!');
        console.log(data);
    })

        socket.on('reload',function() {
        Room.get(User.Room.roomName, function(data) {
            $scope.currentRoom = data[0];
        });
    })

    $scope.users = User.Person;
    console.log($scope.currentRoom);

    $scope.currentUser = User.Person;



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

    $scope.lockIn = function(data) {

        socket.emit('loading', User.Room.roomName);
        $http.post('api/lock/',{url: data.stream_url,
            userData:$scope.currentUser,
            roomData:$scope.currentRoom,
            title:data.title
        })
            .success(function(data){
                // clear the form so our user is ready to enter another

                $scope.currentRoom = data[0];
                $scope.formData = {};

                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
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