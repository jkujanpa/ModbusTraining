"use strict"

const yFsm = require('ysm/lib/yfsm').yFsm;
const yState = require('ysm/lib/yfsm').yState;


var Motor = function() {

    const sm = yFsm();
    const POSITION_TIMEOUT = 500;
    var onPositionCB = null;
    let state = 'no_state';
    let position = 0;
    let timeoutId;

    function signalPosition() {
        console.log('signal position');
        sm.dispatch({signal: 'position'});
    };

    const stopped = yState({
        handler(event) {
            switch (event.signal) {
                case 'move_up':
                    console.log('stopped - move_up');
                    sm.transfer(running_up);
                    break;
                case 'move_down':
                    console.log('stopped - move_down');
                    sm.transfer(running_down);
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter stopped.');
            state = 'stopped';
        },
        exit(event) {
            console.log('Exit stopped.');
        }
    });

    const running_up = yState({
        handler(event) {
            switch (event.signal) {
                case 'stop':
                    console.log('running_up - stop');
                    sm.transfer(stopped);
                case 'position':
                    position += 1;
                    console.log('running_up - position:' + position);
                    onPositionCB(position);
                    timeoutId = setTimeout(signalPosition, POSITION_TIMEOUT);
                    if (position >= 10) {
                        console.log('in top position');
                        position = 10;
                        sm.transfer(stopped);
                    }
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter running_up.');
            state = 'running_up';
            timeoutId = setTimeout(signalPosition, POSITION_TIMEOUT);
        },
        exit(event) {
            console.log('Exit running_up.');
            clearTimeout(timeoutId);
        }
    });

    const running_down = yState({
        handler(event) {
            switch (event.signal) {
                case 'stop':
                    console.log('running_down - stop');
                    sm.transfer(stopped);
                case 'position':
                    position -= 1;
                    onPositionCB(position);
                    timeoutId = setTimeout(signalPosition, POSITION_TIMEOUT);
                    if (position <= 0) {
                        console.log('in bottom position');
                        position = 0;
                        sm.transfer(stopped);
                    }
                    break;
                default:
                    break;
            }
        },
        entry(event) {
            console.log('Enter running_down.');
            state = 'running_down';
            timeoutId = setTimeout(signalPosition, POSITION_TIMEOUT);
        },
        exit(event) {
            console.log('Exit running_down.');
            clearTimeout(timeoutId);
        }
    });

    sm.init(stopped);

    return Object.freeze({
        dispatch: sm.dispatch,
        onPosition: (cb) => {onPositionCB = cb},
        getState: () => state,
        getPosition: () => position,
    });

};

module.exports.Motor = Motor;
