const express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname))

const users = {}
const invertedUsers={}


io.on('connection', function(socket){
  io.sockets.emit('userConnection', io.engine.clientsCount);
  io.sockets.emit("userlist", users)


  socket.on('chat message', function(msg){
    if(users[socket.id]){
      io.emit('chat message',"(user: " + users[socket.id]+")  " + msg);

    }else{
      socket.broadcast.emit('chat message', msg);
  }
  });

  socket.on("login", (msg) => {
    users[socket.id] = msg
    invertedUsers[msg]= socket.id
    io.sockets.emit("userlist", users)
      })

    socket.on('disconnect', () => {
      console.log("YAYAYAYAYAYA")
      io.sockets.emit('userConnection', io.engine.clientsCount)
      delete users[socket.id]
      io.sockets.emit("userlist", users)
      })

    socket.on('user typing', () => {
      io.sockets.emit('typing',users[socket.id])
    })

    socket.on('private', (msg) => {
      if(!invertedUsers[msg.user]){
        io.sockets.connected[socket.id].emit("errors")
        return
      }
      io.sockets.connected[invertedUsers[msg.user]]
      .emit("private message",`(Private message from ${users[socket.id]})  ${msg.message}`)

      io.sockets.connected[socket.id].emit("private message",`(Private message to ${msg.user})  ${msg.message}`)

    })

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
