var express = require('express');
var path = require('path');
var server = express();

server.use(express.static('client'));

server.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/client/index.html'));
})

server.listen(3000);
