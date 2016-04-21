
const tcpServer = require('net').createServer();

const modbus = require("modbus-tcp");
const modServer = new modbus.Server();
const ExceptionCodes = modbus.Exceptions;

const COIL_MAX_COUNT = 2000;

const COIL_COUNT = 24;
const DINPUT_COUNT = 24;


const coils = new Array(COIL_COUNT);
const discreteInputs = new Array(DINPUT_COUNT);

const memory = {
  coils: {
    startAddr: 0,
    endAddr: COIL_COUNT - 1,
    data: coils
  },
  discreteInputs: {
    startAddr: 0,
    endAddr: DINPUT_COUNT-1,
    date: discreteInputs
  }
}

modServer.on("read-coils", (from, to, reply) => {

  if ((to - from) > COIL_MAX_COUNT) {
    console.log('Server: Error ' + ExceptionCodes.ILLEGAL_DATA_VALUE);
    return reply(8, null)
  }

  if (from > COIL_MAX_COUNT || from > COIL_MAX_COUNT) {
    console.log('Server: Error ' + ExceptionCodes.ILLEGAL_DATA_ADDRESS);
    return reply(8, null)
  }

  return reply(null, [ 1, 0, 1, 1 ]);
});

modServer.on("read-discrete-inputs", (from, to, reply) => {
  console.log('Server: read-discrete-inputs');
  return reply(null, [ 1, 0, 1, 1 ]);
});

modServer.on("read-input-registers", (from, to, reply) => {
  console.log('Server: read-input-registers');
  return reply(null, null);
});

modServer.on("read-holding-registers", (from, to, reply) => {
  console.log('Server: read-holding-registers');
  return reply(null, null);
});


modServer.on("write-single-coil", (address, value, reply) => {
  console.log('Server: write-single-coil');
  return reply(null, [ 1, 0, 1, 1 ]);
});

modServer.on("write-single-register", (address, value, reply) => {
  console.log('Server: write-single-register');
  return reply(null, [ 1, 0, 1, 1 ]);
});

modServer.on("write-multiple-coils", (address, value, reply) => {
  console.log('Server: write-multiple-coils');
  return reply(null, [ 1, 0, 1, 1 ]);
});

modServer.on("write-multiple-registers", (address, value, reply) => {
  console.log('Server: write-multiple-registers');
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

tcpServer.listen(3000, () => {
  console.log('Server: Listening port 3000');
});
