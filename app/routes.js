/**
 * Created by Daniel on 8/22/2014.
 */

    // app/routes.js

module.exports = function(app, io) {


    var data = {};
    data["Mouse"] = {name:"Mouse",users:[]};
    data["Owl"] = {name:"Owl",users:[{name:"steve"}]};

    var socketList = [];

    io.sockets.on('connection', function (socket) {

        socketList.push(socket);

        socket.on('joinGroup', function (info) {
            var i = socketList.indexOf(socket);
            socketList[i].roomName = info.roomName;
            socketList[i].userName = info.userName;
            socket.join(info.roomName);

            data[info.roomName].users.push({
                name:info.userName,
                socketIndex: i
                });

            socket.broadcast.to(info.roomName).emit('change',info.userName + " Joined the Party!");

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
            var i = socketList.indexOf(socket);
            var rmNm = socketList[i].roomName;
            var usNm = socketList[i].userName;
            var k = data[rmNm].users.indexOf(usNm);
            console.log(rmNm + " " + usNm);

            //Remove User Info
            data[rmNm].users.splice(k,1);
            socketList.splice(i,1);
            io.sockets.in(rmNm).emit('left', {userName:usNm});
        });
    });

    app.get('/api/room/:name', function(req, res) {
        console.log(data[req.params.name]);
        res.json(data[req.params.name]);
    });

    app.get("/api/all", function(req, res) {
        console.log(data);
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