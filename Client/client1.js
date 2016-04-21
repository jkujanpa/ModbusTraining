"use strict"

const net = require('net');
const modbus = require("modbus-tcp");
const modClient = new modbus.Client();
const readline = require('readline');



const tcpClient = net.connect(3000, 'localhost', () => {
    console.log('Connected to Modbus server!');

    //
    modClient.pipe(tcpClient);


    function completer(line) {
        /*
        let completions = 'rc read-coils' +
                'rdi read-discrete-inputs' +
                'wsc write-single-coil' +
                'wmc write-multiple-coils' +
                'help'.split(' ');
        */
        let completions = 'rc read-coils rdi read-discrete-inputs wsc write-single-coil wmc write-multiple-coils help'.split(' ');
        let hits = completions.filter((c) => { return c.indexOf(line) == 0 });
        // show all completions if none found
        return [hits.length ? hits : completions, line]
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer
    });


    rl.setPrompt('Modbus> ');
    rl.prompt();

    rl.on('line', (line) => {
        let cmd = line.split(' ');
        switch(cmd[0].trim()) {
            case 'rc':
            case 'read-coils': {
                let from = cmd[1] ? Number(cmd[1]) : 0;
                let to = cmd[2] ? Number(cmd[2]) : 0;
                modClient.readCoils(0, from, to, function (err, coils) {
                    if (err) {
                        console.log('Read Error: ' + err);
                        return;
                    }
                    console.log('Coils read: ' + coils);
                    rl.prompt();
                });
                break;
            }
            case 'rdi':
            case 'read-discrete-inputs': {
                let from = cmd[1] ? Number(cmd[1]) : 0;
                let to = cmd[2] ? Number(cmd[2]) : 0;
                modClient.readDiscreteInputs(0, from, to, function (err, inputs) {
                    if (err) {
                        console.log('Read Error: ' + err);
                        return;
                    }
                    console.log('Inputs read: ' + inputs);
                    rl.prompt();
                });
                break;
            }
            case 'wsc':
            case 'write-single-coil': {
                let addr = cmd[1] ? Number(cmd[1]) : 0;
                let value = cmd[2] ? Number(cmd[2]) : 0;
                modClient.writeSingleCoil(0, addr, value, function (err) {
                    if (err) {
                        console.log('Client: Write Error: ' + err);
                        return;
                    }
                    console.log('Client: coil %d written', addr);
                    rl.prompt();
                });
                break;
            }
            case 'wmc':
            case 'write-multiple-coils': {
                let from = cmd[1] ? Number(cmd[1]) : 0;
                let to = cmd[2] ? Number(cmd[2]) : 0;
                let strVals = cmd[3] ? cmd.slice(3, (to - from + 3 + 1)) : ['0'];

                let values = strVals.map(function(num) {
                  return Number(num);
                });
                //console.log(values);

                modClient.writeMultipleCoils(0, from, to, values, function (err) {
                    if (err) {
                        console.log('Client: Write Error: ' + err);
                        return;
                    }
                    console.log('Client: coil %d written', from);
                    rl.prompt();
                });
                break;
            }
            case 'help': {
                console.log('rc,  read-coils            from(=0) to(=0)');
                console.log('rdi, read-discrete-inputs  from(=0) to(=0)');
                console.log('wsc, write-single-coil     address(=0) value(=0)');
                console.log('wmc, write-multiple-coils  from(=0) to(=0) values');
                rl.prompt();
                break;
            }
            default:
                console.log('Say what? ...`' + line.trim() + '`');
                rl.prompt();
                break;
        }
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
