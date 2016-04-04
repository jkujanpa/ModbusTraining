"use strict"

const yFsm = require('ysm/lib/yfsm').yFsm;
const yState = require('ysm/lib/yfsm').yState;
const Motor = require('.//motor').Motor;


var Lift = function() {

    const sm = yFsm();
    const motor = Motor();
    let state = 'no_state';
    let currentFloor = 0;   // current lift location
    let landingCall = 0;    // landing call to this floor
    let carCall = 0;        // car call to this floor

    let timeoutId;

    function noOperation() {
        sm.dispatch({signal: 'no_operation'});
    };

    motor.onPosition((position) => {
        sm.dispatch({signal: "floor", data: position});
    });


    const free = yState({
        handler(event) {
            switch (event.signal) {
                case 'landing_call':
                    landingCall = event.data;
                    console.log('free - landing call to:' + landingCall);
                    sm.transfer(landing_call);
                    break;
                case 'car_call':
                    carCall = event.data;
                    console.log('in_floor - car call to:' + carCall);
                    sm.transfer(car_call);
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter free.');
            state = 'free';
        },
        exit(event) {
            console.log('Exit free.');
        }
    });

    const landing_call = yState({
        handler(event) {
            switch (event.signal) {
                case 'floor':
                    currentFloor = event.data;
                    if (currentFloor === landingCall) {
                        console.log('in ordered floor');
                        sm.transfer(in_floor);
                    }
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter landing_call.');
            state = 'landing_call';

            if (landingCall > currentFloor) {
                // Move up
                console.log("Move up");
                motor.dispatch({signal: "move_up"});
            } else if (landingCall < currentFloor) {
                // Move down
                console.log("Move down");
                motor.dispatch({signal: "move_up"});
            } else {
                // already in floor
                console.log('Already in floor, transfer to in_floor');
                sm.transfer(in_floor);
            }
        },
        exit(event) {
            console.log('Exit landing_call.');
            motor.dispatch({signal: "stop"});
        }
    });

    const in_floor = yState({
        handler(event) {
            switch (event.signal) {
                case 'car_call':
                    carCall = event.data;
                    console.log('in_floor - car call to:' + carCall);
                    sm.transfer(car_call);
                    break;
                case 'no_operation':
                    console.log('in_floor - no_operation');
                    sm.transfer(free);
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter in_floor.');
            state = 'in_floor';
            timeoutId = setTimeout(noOperation, 3000);
        },
        exit(event) {
            console.log('Exit in_floor.');
            clearTimeout(timeoutId);
        }
    });

    const car_call = yState({
        handler(event) {
            switch (event.signal) {
                case 'floor':
                    currentFloor = event.data;
                    if (currentFloor === carCall) {
                        console.log('in ordered floor');
                        sm.transfer(in_floor);
                    }
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter car_call.');
            state = 'car_call';

            if (carCall > currentFloor) {
                // Move up
                console.log("Move up");
                motor.dispatch({signal: "move_up"});
            } else if (carCall < currentFloor) {
                // Move down
                console.log("Move down");
                motor.dispatch({signal: "move_up"});
            } else {
                // already in floor
                console.log('Already in floor, transfer to in_floor');
                sm.transfer(in_floor);
            }
        },
        exit(event) {
            console.log('Exit car_call.');
            motor.dispatch({signal: "stop"});
        }
    });

    sm.init(free);

    return Object.freeze({
        dispatch: sm.dispatch,
        getState: () => state,
        getCurrentFloor: () => currentFloor,
        getLandingCall: () => landingCall,
        getCarCall: () => carCall
    });

};


module.exports.Lift = Lift;
