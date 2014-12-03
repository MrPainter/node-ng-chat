/**
 * Created by kchistyak on 21.10.2014.
 */
var io = require('socket.io'),
    _ = require('underscore'),
    mongo = require('./mongo');

(function() {
    var socketServer = null;

    module.exports.run = function (httpServer) {

        socketServer = io.listen(httpServer);

        socketServer.on('connection', function (socket) {
            console.log('Client connected!');

            socket.on('chat message', function (msg) {
                console.log('Room ' + msg.room + ' sent from ' + socket.username + ': ' + msg.message);
                var responseData = {
                    message: msg.message,
                    user: socket.username,
                    createdAt: msg.createdAt,
                    fileName: msg.fileName || undefined
                };
                socket.broadcast.emit('room ' + msg.room, responseData);

                //Add message to storage
                responseData.room = msg.room;
                mongo.User.findOne({login: responseData.user}, function (err, user) {
                    if(err) {
                        console.error('Error during finding user occured', err);
                    }
                    if(user) {
                        responseData.user = user.id;
                        var message = new mongo.Message(responseData);
                        message.ShiftAndSave();
                    }
                });
            });

            socket.on('join', function (data) {
                socket.username = data.username;
                var userJoinSystemMessage = {
                    message: 'User ' + socket.username + ' joined conversation...',
                    user: 'System',
                    createdAt: new Date(),
                    type: 'system',
                    attachments: {user: socket.username}
                };
                socket.broadcast.emit('room ' + data.room, userJoinSystemMessage);
                console.log('User ' + socket.username + ' joined room ' + data.room);
            });
        });
    };
})();