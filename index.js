const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const ChangesStream = require('changes-stream');

const changes = new ChangesStream({
  db: 'http://replicate.npmjs.com',
  since: "now",
  include_docs: true
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  changes.on('data', function(change) {
    socket.emit('change', change.doc.name)
  }); 
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
