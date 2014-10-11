/**
 * Created by Daniel on 8/22/2014.
 */
angular.module('RoomCtrl',[]).controller('RoomController', function($location, $scope ,$http, Room, User, socket, notify, ngAudio) {

    $scope.roomName = $location.path().split("/")[1];

    $http.get("/api/room/" + $location.path().split("/")[1])
        .success(function(data) {
            $scope.currentRoom = data;
            console.log(data);
        })
        .error(function(err) {
            console.log(err);
        });


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

socket.emit('joinGroup',{ roomName:$scope.roomName, userName: "someguy" });

//  User Join ===========================================

socket.on('change',function(data) {
    console.log("caught Change " + data);
    $scope.message = data;
    notify.run;
    setTimeout(function() {
        $scope.message = "";
    }, 2000);

    http.get("/api/room/" + $location.path().split("/")[1])
        .success(function(data) {
            $scope.currentRoom = data;
            console.log(data);
        })
        .error(function(err) {
            console.log(err);
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

            $scope.loadIt(0,0);

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