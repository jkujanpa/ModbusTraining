"use strict"

const net = require('net');
const modbus = require("modbus-tcp");
const modClient = new modbus.Client();



const tcpClient = net.connect(3000, 'localhost', () => {
   //'connect' listener
  console.log('Client: Connected to server!');

  //tcpClient.pipe(modClient).pipe(tcpClient);
  //tcpClient.pipe(modClient);
  modClient.pipe(tcpClient);

  console.log('Client: readCoils 0 - 3000');
  modClient.readCoils(0, 0, 5, function (err, coils) {
    if (err) {
      console.log('Client: Read Error: ' + err);
      return;
    }
    console.log('Client: coils read: ' + coils);
  });

});

/*
tcpClient.on('data', (data) => {

  console.log('Client: data received ' + data.length);
  //console.log('data: ' + data[0] + ':' + data[1] + ':' + data[2] + ':' + data[3] + ':' + data[4] + ':' + data[5] + ':' + data[6] + ':' + data[7] + ':'
  //      + data[8] + ':' + data[9] + ':' + data[10] + ':' + data[11] + ':' + data[12] + ':' + data[13] + ':' + data[14] + ':' + data[15]);

  //tcpClient.end();
});
*/

tcpClient.on('end', () => {
  console.log('Client: disconnected from server');
});
