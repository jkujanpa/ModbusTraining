"use strict"

const tcpServer = require('net').createServer();
const modbus = require("modbus-tcp");
const modServer = new modbus.Server();
const ExceptionCodes = modbus.Exceptions;

const Lift = require('../Server/lift').Lift;


const memory = {
    coils: {
        startAddr: 0x00,  // 0
        endAddr: 0x17,    // 23 ==> 24 bits
        data: new Buffer(100)
    },
    discreteInputs: {
        startAddr: 0x00,  // 0
        endAddr: 0x17,    // 23 ==> 24 bits
        data: new Buffer(100)
    }
}


modServer.on("read-coils", (from, count, reply) => {
    console.log('Server: read %d coils from %d', count, from);
    if ((count - from) > memory.coils.endAddr) {
        console.log('Server: Error ' + ExceptionCodes.ILLEGAL_DATA_VALUE);
        return reply(ExceptionCodes.ILLEGAL_DATA_VALUE, null)
    }

    memory.coils.data[0] = 1;
    memory.coils.data[1] = 1;
    memory.coils.data[2] = 1;
    memory.coils.data[3] = 1;
    memory.coils.data[4] = 1;
    memory.coils.data[5] = 0;
    memory.coils.data[6] = 1;

    const coils = memory.coils.data;
    return reply(null, coils.slice(from, count-1));
});

modServer.on("write-single-coil", (address, value, reply) => {
    console.log('Server: write-single-coil ' + address + ':' + value[0]);
    //return reply(null, [ 1, 0, 1, 1 ]);
    return reply(ExceptionCodes.ILLEGAL_DATA_VALUE, null)
});



/*
modServer.on("read-discrete-inputs", (from, to, reply) => {
  console.log('Server: read-discrete-inputs');
  const inputs = memory.discreteInputs.data;
  return reply(null, inputs.slice(from, to));
});

modServer.on("read-input-registers", (from, to, reply) => {
  console.log('Server: read-input-registers');
  return reply(null, null);
});

modServer.on("read-holding-registers", (from, to, reply) => {
  console.log('Server: read-holding-registers');
  return reply(null, null);
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
*/

/// TCP Server:

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


/*
var lift = Lift();
lift.dispatch({signal: "landing_call", data: 5});
//lift.dispatch({signal: "floor", data: 2});

setTimeout(function(){
    console.log("timeout");
}, 5000);
*/
