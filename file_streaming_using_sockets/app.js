const fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var chunks = [];

io.on('connection', function(socket){
    socket.on("send-chunk",function (chunk) {
      chunks.push(chunk);
    });
    socket.on("send-chunk-completed",function (extention) {
    fs.writeFile('./file'+"."+extention,chunks.join(""),{encoding: 'base64'},function(err){
      //console.log("DONE");
      socket.emit('upload-completed')
    });
    });
});


http.listen(5000, function(){
  console.log('listening on *:5000');
});
