const net = require('node:net');

const server = net.createServer();

const connections = [];

const informAll = (msg) => {
  connections.map(({ socket }) => {
    socket.write(msg);
  });
};

server.on('connection', (socket) => {
  console.log(`New connection has been established!`);
  const userId = connections.length + 1;

  informAll(`User ${userId} joined!`);
  socket.write(`userId=${userId}`);

  connections.push({ userId, socket });

  socket.on('data', (data) => {
    const message = data.toString('utf-8');
    informAll(`> User ${userId}: ${message}`);
  });

  socket.on('end', () => {
    informAll(`User ${userId} left the chat!`);
  });
});

server.on('close', () => {
  console.log('Server cloned');
});

server.listen(3000, '127.0.0.1', () => {
  console.log(`Server is listening on`, server.address());
});
