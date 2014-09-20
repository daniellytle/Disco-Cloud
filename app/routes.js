/**
 * Created by Daniel on 8/22/2014.
 */

    // app/routes.js

module.exports = function(app, io) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // Model

    var mongoose = require('mongoose');


    mongoose.connect('mongodb://johnny:heistheman@ds035290.mongolab.com:35290/discoclouddb');

    users = [{
        id: 0,
        ready  :false
    }]

    var userData = {};
    var users = [];
    io.sockets.on('connection', function (socket) {

        //Add user to array
        users.push(socket);


        // Joiner Person
        socket.on('joinGroup', function (data) {

           socket.join(data.roomName);
           userData = data;

           socket.broadcast.to(data.roomName).emit('joiner',data.userName + " Joined the Party!");

        });

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

    // ROOM API CALLS ===========================================================

    // Schema
    var Schema = mongoose.Schema;

    var ObjectID = Schema.ObjectId;

    var userSchema = new Schema({
        id      : ObjectID,
        name    : String,
        songURL : String,
        title   : String,
        locked  : String
    });

    var roomSchema = new Schema({
        roomName : String,
        users    : [userSchema]
    });

    var Room = mongoose.model('Room', roomSchema);
    var User = mongoose.model('User', userSchema);

    // JOIN EXISTING ROOM or UPDATE SONG

    app.post('/api/room/:roomkey', function(req, res) {
        var user = new User({
            name : req.body.Name,
            songURL : '',
            title  : '',
            locked : 'false'
        });

        var conditions = { roomName: req.params.roomkey }
            , update = { $push: { users: user }}
            , options = {};

        Room.update(conditions,update, options,
            function(err, numAffected) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

                Room.find(conditions,function(err, room)
                {
                    if (err)
                        res.send(err)
                    res.json(room);
                });
             // return the room in JSON format
        });
    });

        // CREATE NEW ROOM

    app.post('/api/room', function(req, res) {

        var user = new User({
            name : req.body.Name,
            songURL : '',
            title: '',
            locked : 'false'
        });

        new Room({
            roomName : req.body.roomKey,
            users : [ user ]
        }).save(function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Room.find({
                roomName : req.body.roomKey
            },function(err, room)
            {
                if (err)
                    res.send(err)
                res.json(room);
            });
        });

    });

    // GET ALL USERS FROM ROOM =============================================

    app.get('/api/room/:roomKey', function(req, res) {

        Room.find({
            roomName : req.params.roomKey
        }, function(err, room) {
            if (err)
                res.send(err);

                res.json(room);
            });

    });

    // DELETE USER FROM ROOM ===============================================

    app.delete('/api/room/:roomKey', function(req, res) {

        var conditions = { roomName: req.body.roomData.roomName ,
                'users._id' : req.body.userData._id}
            , update = { $pull: {'users' : {_id:req.userData.id} }}
            , options = {};

        Room.update(conditions,update, options,
            function(err, numAffected) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)

                Room.find(conditions,function(err, room)
                {
                    if (err)
                        res.send(err)
                    res.json(room);
                });
                // return the room in JSON format
            });

    });


    // Lock SONG FOR USER

    app.post('/api/lock', function(req, res) {

        var conditions = { roomName: req.body.roomData.roomName ,
            'users._id' : req.body.userData._id}
            , update = { $set: {'users.$.songURL' : req.body.url,'users.$.title': req.body.title }}
            , options = {};

        Room.update(conditions,update, options,
            function(err, numAffected) {

                // if there is an error retrieving, send the error. nothing after res.send(err) will execute
                if (err)
                    res.send(err)

                Room.find(conditions,function(err, room)
                {
                    if (err)
                        res.send(err)
                    res.json(room);
                });
                // return the room in JSON format
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