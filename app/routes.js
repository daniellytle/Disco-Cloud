/**
 * Created by Daniel on 8/22/2014.
 */

    // app/routes.js

module.exports = function(app, io) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // Model

    var redis = require("redis");
        var client = redis.createClient(
            10373,"pub-redis-10373.us-east-1-3.3.ec2.garantiadata.com",
            {no_ready_check: true}
        );
    client.auth("Mmpdrw123");


    client.on("error", function(err) {
        console.log("error - " + err);
    });

    client.set("string key", "string val", redis.print);
    client.hset("hash key", "hashtest 1", "some value", redis.print);
    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);

    var user = {
        name:String,
        songURL:String,
        loaded:false
    }

    var Room = [];

    var currentUser;

    io.sockets.on('connection', function (socket) {

        // On Join ======================================

        socket.on('joinGroup', function (data) {

            currentUser = new user({



            });

            socket.join(data.roomName);

            // Keep single user data
            userData = data;

            socket.broadcast.to(data.roomName).emit('joiner',data.userName + " Joined the Party!");

        });

        socket.on('end', function() {
            
        })

        socket.on('loaded', function(id) {

        })

        socket.on('start', function(data) {
            var then = new Date().getMilliseconds();
            io.sockets.in(data).emit('play',then);
        })

        socket.on('LoadAll', function(data) {
            io.sockets.in(data).emit('load',data);
        })

        // Bring back pplayers current timer;
        socket.on('timeCheck', function(data) {
            // IMPLEMENT
        });

        //  To reload everyones data
        socket.on('loading', function (data){
            io.sockets.in(data).emit('reload',{});
        })

        socket.on('end', function (data) {

            // Get Everybody and then push play;

        });

            socket.on('disconnect', function() {
                // TODO Implement
            });
        });


    // SOCKET IO ================================================================

// route to handle creating (app.post)
    // route to handle delete (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};