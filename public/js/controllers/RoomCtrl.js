/**
 * Created by Daniel on 8/22/2014.
 */
angular.module('RoomCtrl',[]).controller('RoomController', function($location, $scope ,$http, Room, User, socket, notify, ngAudio, playAnim, notifyAnim) {

    $scope.roomName = $location.path().split("/")[1];
    $scope.songInfo = null;
    $scope.playing = false;

// TEMP LOAD
    $scope.load = function(song)
    {
        try {
            $scope.sound = ngAudio.load(song.stream_url + '?client_id=YOUR_CLIENT_ID');
            $scope.songInfo = song;
            socket.emit('lock',song);

        } catch (exception) {
            console.log(exception);
            alert("didn't load");
        }
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
        $scope.playing = !$scope.playing;
        $scope.playing ? $scope.sound.play() : $scope.sound.pause();
        playAnim.change();
        playAnim.run();

        socket.emit('start',$scope.currentRoom.roomName);
    };

    $scope.$watch(function() {
        if($scope.playing && $scope.sound.progress == 1) {
            $scope.playing = !$scope.playing;
            playAnim.change();
            playAnim.run();
        }
    });

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
        notifyAnim.run();


        setTimeout(function() {
            notifyAnim.out();
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
        $scope.message = data.userName + " left";
        notifyAnim.run();


        setTimeout(function() {
            notifyAnim.out();
        }, 2000);
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
        socket.emit('searching',{})
        $scope.player.get('/tracks', { q: $scope.searchQuery, limit:20}, function(tracks) {
            $scope.$apply(function() {
                $scope.searchResults = tracks;
                console.log(tracks);
            })

        });
    }

    socket.on('change',function() {
        $http.get("/api/room/" + $location.path().split("/")[1])
            .success(function(data) {
                $scope.currentRoom = data;
                console.log(data);
            })
            .error(function(err) {
                console.log(err);
            });
    });

//    $scope.appendSongs = function(num) {
//        $scope.player.get('/tracks', { q: $scope.searchQuery, limit:num}, function(tracks) {
//            for(var i=10;i<0;--i) {
//                $scope.results.push(tracks[num - i]);
//            }
//            console.log(tracks);
//        });
//    }
//    $scope.searchResults = [];
//    notifyAnim.init($scope.appendSongs($scope.searchResults.size + 10));

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

    $scope.userName = prompt("Enter Your Name");
    socket.emit('joinGroup',{ roomName:$scope.roomName, userName: $scope.userName});


});