var userService = require('../routes/users/services/userServices');
var socketService = require('./services/socketServices');


exports.socketInitialize = function (server) {
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {

        socket.on('user-active', function (data) {
            userService.verifyUserSession({ access_token: data.access_token }).then((result) => {
                if (result && result.length) {
                    var socketKey = result[0].user_id;
                    socketService.insert_into_redis_users(socketKey + 'USER' + socket.id, socket.id);
                }
            }).catch((err) => {

            });
        });

        socket.on('send-message', function (data) {
            userService.verifyUserSession({ access_token: data.access_token }).then((result) => {
                if (result && result.length) {
                    delete data.access_token;
                    data.form_user_id = result[0].user_id;
                    socketService.get_redis_client_users(data.to_user_id + '*', function (userSockets) {
                        if(userSockets && userSockets.length) {
                            userSockets.forEach(function (sockets) {
                                var response = {
                                    "socket_id": socketService.getSocketID(sockets),
                                    "response": data
                                };
                                socket.emit('receive-message', response);
                            });
                        }
                    });
                    userService.sendMessage(data).then((data)=>{}).catch((err)=>{});       
                }
            }).catch((err) => {});            
        });

        socket.on('read-message', function (data) {
            userService.verifyUserSession({ access_token: data.access_token }).then((result) => {
                if (result && result.length) {
                    delete data.access_token;
                    socketService.get_redis_client_users(data.sender_id + '*', function (userSockets) {
                        if(userSockets && userSockets.length) {
                            userSockets.forEach(function (sockets) {
                                var response = {
                                    "socket_id": socketService.getSocketID(sockets),
                                    "response": data
                                };
                                socket.emit('read-message-ack', response);
                            });
                        }
                    });
                    userService.readMessage(data).then((data)=>{}).catch((err)=>{});       
                }
            }).catch((err) => {});            
        });

    });

    

}