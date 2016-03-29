"use strict"

const yFsm = require('ysm/lib/yfsm').yFsm;
const yState = require('ysm/lib/yfsm').yState;
//const util = require('util');

var Lift = function() {

    const sm = yFsm();
    const dispatch = sm.dispatch;
    let persons = 0;
    let floor = 0;
    let order = 0;  // ordrer from [order] floor

    const free = yState({
        handler(event) {
            switch (event.signal) {
                //case 'enter':
                //    console.log('free - enter');
                //    console.log('Transfer to s11');
                //    return self.transfer(s11);
                case 'landing_call':
                    order = event.data;
                    console.log('free - landing order to:' + order);
                    console.log('Transfer to landingOrdered');
                    sm.transfer(landingOrdered);
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter free.');
        },
        exit(event) {
            console.log('Exit free.');
        }
    });

    const landingOrdered = yState({
        handler(event) {
            switch (event.signal) {
                case 'floor':
                    floor = event.data;
                    if (floor === order) {
                        console.log('in ordered floor');
                        console.log('Transfer to in_floor');
                        sm.transfer(in_floor);
                    }
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter landingOrdered.');
            if (order > floor) {
                // Move up
                console.log("Move up");
            } else if (order < floor) {
                // Move down
                console.log("Down up");
            } else {
                // already in floor
                console.log('Already in floor, transfer to in_floor');
                sm.transfer(in_floor);
            }
        },
        exit(event) {
            console.log('Exit landingOrdered.');
        }
    });

    const in_floor = yState({
        handler(event) {
            switch (event.signal) {
                case 'enter':
                    console.log('in_floor - enter (' + e.data + ')');
                    persons = e.data;
                    break;
                case 'exit':
                    console.log('in_floor - exit (0)');
                    persons = 0;
                    break;
                case 'free': // change to timer check
                    console.log('in_floor - free');
                    console.log('Transfer to free');
                    //return self.transfer(free);
                case 'car_call':
                    console.log('in_floor - order (' + e.data + ')');
                    order = e.data;
                    //return self.transfer(ordered);
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter in_floor.');
        },
        exit(event) {
            console.log('Exit in_floor.');
        }
    });






    sm.init(free);

    return Object.freeze({
        dispatch,
    });

};


var lift = Lift();
lift.dispatch({signal: "landing_call", data: 2});
lift.dispatch({signal: "floor", data: 1});
lift.dispatch({signal: "floor", data: 2});

/*

    var s21 = new QState(function(e) {
        switch (e.signal) {
            case 'tm:a':
                console.log('s21 - a');
                console.log('Self transfer to s21');
                return self.transfer(s21);
            case 'tm:g':
                console.log('s21 - g');
                console.log('Transfer to s11');
                return self.transfer(s11);
            case 'tm:b':
                console.log('s21 - b');
                console.log('Transfer to s211');
                return self.transfer(s211);
        }

        return QHsm.unhandled();
    }, s2, function() {
        console.log('Enter s21.');
    }, function() {
        console.log('Exit s21.');
    }, function() {
        console.log('Init s21.');
        console.log('Transfer to s211');
        return self.transfer(s211);
    });

    var s211 = new QState(function(e) {
        switch (e.signal) {
            case 'tm:d':
                console.log('s211 - d');
                console.log('Transfer to s21');
                return self.transfer(s21);
            case 'tm:h':
                console.log('s211 - h');
                console.log('Transfer to s');
                return self.transfer(s);
        }

        return QHsm.unhandled();
    }, s21, function() {
        console.log('Enter s211.');
    }, function() {
        console.log('Exit s211.');
    });
* /

    QActive.call(self, initial);
};



*/
