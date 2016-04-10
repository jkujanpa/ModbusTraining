"use strict"

const net = require('net');
const modbus = require("modbus-tcp");
const modClient = new modbus.Client();
const readline = require('readline');



const tcpClient = net.connect(3000, 'localhost', () => {
    console.log('Connected to Modbus server!');

    //
    modClient.pipe(tcpClient);

    /*
    modClient.writeSingleCoil(0, 0, 5, 1); , function (err, coils) {
        if (err) {
            console.log('Client: Read Error: ' + err);
            return;
        }
        console.log('Client: coil 5 written');
    });
    */

    function completer(line) {
        let completions = 'ReadCoils WriteSingleCoil WriteMultipleCoils'.split(' ');
        let hits = completions.filter((c) => { return c.indexOf(line) == 0 });
        // show all completions if none found
        return [hits.length ? hits : completions, line]
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer
    });


    rl.setPrompt('MOD> ');
    rl.prompt();

    rl.on('line', (line) => {
        let cmd = line.split(' ');
        switch(cmd[0].trim()) {
            case 'ReadCoils':
                let addr = cmd[1] ? Number(cmd[1]) : 0;
                let length = cmd[2] ? Number(cmd[2]) : 0;
                modClient.readCoils(0, addr, length, function (err, coils) {
                    if (err) {
                        console.log('Read Error: ' + err);
                        return;
                    }
                    console.log('Coils read: ' + coils);
                });
                break;
            default:
                console.log('Say what? I might have heard `' + line.trim() + '`');
                break;
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
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

/*
tcpClient.on('end', () => {
  console.log('Client: disconnected from server');
});
*/


tcpClient.on('error', (err) => {
    console.log(err);
});
