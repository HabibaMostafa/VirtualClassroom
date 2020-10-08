const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/team', (req, res) => {
  res.sendFile(__dirname + '/public/team.html');
});

app.get('/ta', (req, res) => {
  res.sendFile(__dirname + '/public/TA.html');
});

app.get('/professor', (req, res) => {
  res.sendFile(__dirname + '/public/professor.html');
});

// tech namespace
const tech = io.of('/tech');

// socke.io server works by events, on indicated events
tech.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    tech.in(data.room).emit('message', `New user joined ${data.room} room`);
  });

  socket.on('message', (data) => {
    console.log(`message: ${data.msg}`);
    tech.in(data.room).emit('message', data.msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    tech.emit('message', 'user disconnected');
  })
});