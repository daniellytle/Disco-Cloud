/**
 * Created by Daniel on 8/26/2014.
 */
angular.module("SocketService", []).factory('socket', function($rootScope) {
    // switch back to window.location.hostname
    var socket = io.connect(window.location.hostname);
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {

            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
})