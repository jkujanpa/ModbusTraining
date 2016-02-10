
const net = require('net');

const modbus = require("modbus-tcp");
const modClient = new modbus.Client();


const tcpClient = net.connect(3000, 'localhost', () => {
   //'connect' listener
  console.log('Client: Connected to server!');

  //tcpClient.pipe(modClient).pipe(tcpClient);
  //tcpClient.pipe(modClient);
  modClient.pipe(tcpClient);

  //modClient.readCoils(0, 10, 13, function (err, coils) {
  //  console.log('Client: readCoils');
  //    // coils = [ 1, 0, 1, 1 ]
  //});

  setTimeout(() => {
    console.log('Client: readCoils');
    modClient.readCoils(0, 10, 13, function (err, coils) {
      console.log('Client: coils read: ' + coils);
    });
  }, 1000);
});

tcpClient.on('data', (data) => {
  console.log('Client: data received ' + data.toString());
  //tcpClient.end();
});

tcpClient.on('end', () => {
  console.log('Client: disconnected from server');
});
