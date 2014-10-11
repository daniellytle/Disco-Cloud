/**
 * Created by Daniel on 8/22/2014.
 */

    // app/routes.js

module.exports = function(app, io) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // REDIS STUFF

//    var redis = require("redis");
//        var client = redis.createClient(
//
//        );
//    //client.auth();
//
//
//    client.on("error", function(err) {
//        console.log("error - " + err);
//    });
//
//    client.set("string key", "string val", redis.print);
//    client.hset("hash key", "hashtest 1", "some value", redis.print);
//    client.hset(["hash key", "hashtest 2", "some other value"], redis.print);

    // SAMPLE DATA
    var data = [
        {name:"MOUSE",
            users:[
                {
                    name:"bob",
                    songURL:"",
                    title:"that one song",
                    loaded:false
                },
                {
                    name:"steve",
                    songURL:"",
                    title:"the other song",
                    loaded:false
                }
            ]},
        {name:"DONKEY",
            users:[
                {
                    name:"bob",
                    songURL:"",
                    title:"that one song",
                    loaded:false
                },
                {
                    name:"steve",
                    songURL:"",
                    title:"the other song",
                    loaded:false
                }
            ]}
    ];

    io.sockets.on('connection', function (socket) {

        // On Join ======================================

        socket.on('joinGroup', function (data) {

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

    app.get('/api/room/:name', function(req, res) {
        res.json(data);
    });

    app.get("/api/all", function(req, res) {
        res.json(data);
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