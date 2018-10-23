const fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  console.log("aaaaa");
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
    var readStream = fs.createReadStream(__dirname+'/file.jpg',{
      encoding: 'binary'
    });
    readStream.on('data', function(chunk){
      // setTimeout(function(){
      //   socket.emit('data-chunk',chunk);
      // },5000)
      socket.emit('data-chunk',chunk);

    });
    readStream.on('end', function(){
      socket.emit('completed',"END");
    });
});


http.listen(5000, function(){
  console.log('listening on *:5000');
});
