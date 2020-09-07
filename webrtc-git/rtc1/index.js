var express = require('express');
var app = express();
var path = require("path");

var fs = require('fs');
var http = require('http');
var https = require('https');
var IO = require('socket.io');
var privateKey = fs.readFileSync('./https/server.key', 'utf8');
var ca = fs.readFileSync('./https/server.csr', 'utf8');
var certificate = fs.readFileSync('./https/server.crt', 'utf8');
var credentials = { key: privateKey, ca: ca, cert: certificate };

app.use(express.static('dist'));
var httpServer = http.createServer(app);

var httpsServer = https.createServer(credentials, app);
// var SkyRTC = require('skyrtc').listen(httpsServer);
var PORT = 3001;
var SSLPORT = 4011;

httpServer.listen(PORT, function () {
  console.log('HTTP Server is running on: http://localhost:%s', PORT);
});

httpsServer.listen(SSLPORT, function () {
  console.log('HTTPS offer Server is running on: https://localhost:%s', SSLPORT);
});
var io = IO(httpsServer);
app.use(express.static(path.join(__dirname, '')));

// Welcome
app.get('/', function (req, res) {
  if (req.protocol === 'https') {
    res.status(200).send('Welcome to Safety Land!');
  }
  else {
    res.status(200).send('Welcome!');
  }
});



// 所有用户名单
var allUsers = {};
// 所有客户端
var allSockets = {};

io.on('connection', function (socket) {//监听客户端连接,回调函数会传递本次连接的socket

  socket.on('message', function (data) {
    var data = JSON.parse(data)
    console.log(data);
    if (data.event == "join") {
      user = data.name;
      //保存用户信息
      allUsers[user] = true;
      allSockets[user] = socket;
      socket.name = user;
      showUserInfo(allUsers);
    } else if (data.event == "call") {
      var conn = allSockets[data.connectedUser];
      sendTo(conn, {
        "event": "call",
        "name": socket.name
      })
    } else if (data.event == "candidate") {
      console.log("candidate方法"+data.connectedUser)
      console.log("candidate方法"+socket.otherName)
      
      var conn1 = allSockets[data.connectedUser];
      var conn2 = allSockets[socket.otherName];
      
      if (conn1 != null) {
        sendTo(conn1, {
          "event": "candidate",
          "candidate": data.candidate
        });
      } else {
        sendTo(conn2, {
          "event": "candidate",
          "candidate": data.candidate
        });
      }
    } else if (data.event == "accept") {
      var conn = allSockets[data.connectedUser];
      if (conn != null) {
        if (data.accept) {
          sendTo(conn, {
            "event": "accept",
            "accept": true
          });
        } else {
          allUsers[data.connectedUser] = true;
          sendTo(conn, {
            "event": "accept",
            "accept": false
          });
        }
      }
    } else if(data.event == "offer"){
      // console.log("offer"+data.connectedUser)
      var conn = allSockets[data.connectedUser];
        allUsers[user] = false;
        if (conn != null) {
          showUserInfo(allUsers);
          //setting that UserA connected with UserB
          socket.otherName = data.connectedUser;
          sendTo(conn, {
            "event": "offer",
            "offer": data.offer,
            "name": socket.name
          });
        } else {
          sendTo(socket, {
            "event": "msg",
            "message": "Not found this name"
          });
        }
    }else if(data.event == "answer"){
      console.log("Sending answer to: ", data.connectedUser);
        //for ex. UserB answers UserA
        var conn = allSockets[data.connectedUser];
        allUsers[user] = false;
        if (conn != null) {
          showUserInfo(allUsers);
          socket.otherName = data.connectedUser;
          sendTo(conn, {
            "event": "answer",
            "answer": data.answer
          });
        }
    }
    // console.log('message: ' + msg);
    // io.emit('message', msg);
  });
  socket.on('disconnect', function () {
    console.log(socket.name + "与服务器断开");
    delete allUsers[socket.name];
    delete allSockets[socket.name];
    showUserInfo(allUsers);
  });


})

function showUserInfo(allUsers) {
  sendTo(io, {
    "event": "show",
    "allUsers": allUsers,
  });
}

function sendTo(connection, message) {
  connection.send(message);
}
