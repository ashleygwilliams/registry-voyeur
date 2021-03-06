const port = process.env.PORT || '8080';
const host = process.env.HOST || '0.0.0.0';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const ChangesStream = require('changes-stream');

const changes = new ChangesStream({
  db: 'https://replicate.npmjs.com',
  since: "now",
  include_docs: true
});

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  changes.on('data', function(change) {
    var version = change.doc["dist-tags"].latest;
    socket.emit('change', {
      name: change.doc.name,
      author: change.doc.versions[version]._npmUser.name,
      version: version
    })
  }); 
});

http.listen(port, function(){
  console.log('listening on' + host + ":" + port);
});
