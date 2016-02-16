
const tcpServer = require('net').createServer();

const modbus = require("modbus-tcp");
const modServer = new modbus.Server();
const ExceptionCodes = modbus.Exceptions;

const mb = require("jsmodbus");



const coils = new Buffer(3);
const discreteInputs = new Buffer(3);

const memory = {
  coils: {
    startAddr: 0x00,  // 0
    endAddr: 0x17,    // 23 ==> 24 bits
    data: coils
  },
  discreteInputs: {
    startAddr: 0x00,  // 0
    endAddr: 0x17,    // 23 ==> 24 bits
    date: discreteInputs
  }
}

modServer.on("read-coils", (from, to, reply) => {

  console.log('Server: read-coils from ' + from + ' to ' + to);
  if ((to - from) > memory.coils.endAddr) {
    console.log('Server: Error ' + ExceptionCodes.ILLEGAL_DATA_VALUE);
    return reply(ExceptionCodes.ILLEGAL_DATA_VALUE, null)
    //return reply("foo", null)
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

/*
tcpServer.listen(3000, () => {
  console.log('Server: Listening port 3000');
});
*/


var readCoils = function (start, quant) {

    var resp = [];
    for (var i = 0; i < quant; i += 1) {
        resp.push(true);
    }

    return [resp];
};



mb.createTCPServer(3000, '127.0.0.1', function (err, server) {

    if (err) {
        console.log(err);
        return;
    }

    server.addHandler(1, readCoils);
    //server.addHandler(4, readInputRegHandler);
    //server.addHandler(5, writeSingleCoil);
    //server.addHandler(6, writeSingleRegister);

});
