
const tcpServer = require('net').createServer();

const modbus = require("modbus-tcp");
const modServer = new modbus.Server();


modServer.on("read-coils", (from, to, reply) => {
  console.log('Server: Coils read');
  return reply(null, [ 1, 0, 1, 1 ]);
});

modServer.on("data", (from, to, reply) => {
  console.log("Server: data received!");
});


/// Server:

function onConnection(socket) {
  console.log('Server: Client connected!');
  //socket.pipe(modServer).pipe(socket);
  //socket.pipe(modServer);
  modServer.pipe(socket);
}

tcpServer.on('connection', onConnection);

tcpServer.listen(3000);
