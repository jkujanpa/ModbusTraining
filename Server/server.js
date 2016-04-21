"use strict"

const tcpServer = require('net').createServer();
const modbus = require("modbus-tcp");
const modServer = new modbus.Server();
const ExceptionCodes = modbus.Exceptions;

const lift = require('../Server/lift').Lift();

const COIL_COUNT = 24;
const DINPUT_COUNT = 24;
const INPUT_REG_COUNT = 24;


const memory = {
    coils: {
        startAddr: 0,
        endAddr: COIL_COUNT - 1,
        data: new Buffer(COIL_COUNT)
    },
    discreteInputs: {
        startAddr: 0,
        endAddr: DINPUT_COUNT - 1,
        data: new Buffer(DINPUT_COUNT)
    },
    inputRegisters: {
        startAddr: 0,
        endAddr: INPUT_REG_COUNT * 2 - 2,
        data: new Buffer(INPUT_REG_COUNT * 2)
    }
}

memory.coils.data.fill(0);
memory.discreteInputs.data.fill(0);
memory.inputRegisters.data.fill(0);

lift.emitter.on('floor', (floor) => {
    console.log('Server: lift in %d:th floor', floor);
    memory.inputRegisters.data.writeUInt16BE(floor, 0);
});

modServer.on("read-coils", (from, to, reply) => {
    console.log('Server: read coils from %d to %d ', from, to);
    /*if ((count - from) > memory.coils.endAddr) {
        console.log('Server: Error ' + ExceptionCodes.ILLEGAL_DATA_VALUE);
        return reply(ExceptionCodes.ILLEGAL_DATA_VALUE, null)
    }*/

    const coils = memory.coils.data.slice(from, to + 1);
    console.log(coils);

    return reply(null, coils);
});

modServer.on("read-discrete-inputs", (from, to, reply) => {
    console.log('Server: read discrete inputs from %d to %d ', from, to);
    /*if ((count - from) > memory.coils.endAddr) {
        console.log('Server: Error ' + ExceptionCodes.ILLEGAL_DATA_VALUE);
        return reply(ExceptionCodes.ILLEGAL_DATA_VALUE, null)
    }*/

    const inputs = memory.discreteInputs.data.slice(from, to + 1);
    console.log(inputs);

    return reply(null, inputs);
});

modServer.on("write-single-coil", (address, value, reply) => {
    console.log('Server: write-single-coil ' + address + ':' + value[0]);
    memory.coils.data[address] = value[0];

    if (address >= 0 && address <= 5 && value[0]) {
        lift.dispatch({signal: "landing_call", data: address});
    }
    if (address >= 6 && address <= 11 && value[0]) {
        lift.dispatch({signal: "car_call", data: address});
    }

    return reply(null);
});

modServer.on("write-multiple-coils", (from, to, values, reply) => {
    console.log('Server: write-multiple-coils ' + values);
    return reply(null);
});



/// TCP Server:

function onConnection(socket) {
  console.log('Server: Client connected!');
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
