"use strict"


const EventEmitter = require('events').EventEmitter;
const yFsm = require('ysm/lib/yfsm').yFsm;
const yState = require('ysm/lib/yfsm').yState;


var Motor = function() {
    const sm = yFsm();
    const emitter = new EventEmitter();
    let positionTimeout = 50;
    let onPositionCB = null;
    let state = 'no_state';
    let position = 0;
    let timeoutId = 0;

    function signalPosition() {
        //console.log('signal position');
        sm.dispatch({signal: 'position'});
    };

    const stopped = yState({
        handler(event) {
            switch (event.signal) {
                case 'move_up':
                    //console.log('stopped - move_up');
                    sm.transfer(running_up);
                    break;
                case 'move_down':
                    //console.log('stopped - move_down');
                    sm.transfer(running_down);
                    break;
                default:
                    //console.log('!!! stopped - Unhandled signal: ' + event.signal);
                    break;
            }
        },
        entry(event) {
            //console.log('Motor: Enter stopped');
            state = 'stopped';
        },
        exit(event) {
            //console.log('Motor: Exit stopped');
        }
    });

    const running_up = yState({
        handler(event) {
            switch (event.signal) {
                case 'stop':
                    //console.log('running_up - stop');
                    sm.transfer(stopped);
                    break;
                case 'position':
                    position += 1;
                    //console.log('Motor: running_up - position:' + position);
                    process.nextTick(() => {emitter.emit('pos', position)});
                    timeoutId = setTimeout(signalPosition, positionTimeout);
                    if (position >= 10) {
                        //console.log('in top position');
                        position = 10;
                        sm.transfer(stopped);
                    }
                    break;
                default:
                    //console.log('!!! running_up - Unhandled signal: ' + event.signal);
                    break;
            }
        },
        entry(event) {
            //console.log('Motor: Enter running_up');
            state = 'running_up';
            timeoutId = setTimeout(signalPosition, positionTimeout);
        },
        exit(event) {
            //console.log('Motor: Exit running_up');
            clearTimeout(timeoutId);
        }
    });

    const running_down = yState({
        handler(event) {
            switch (event.signal) {
                case 'stop':
                    //console.log('running_down - stop ' + new Date().getTime());
                    sm.transfer(stopped);
                    break;
                case 'position':
                    position -= 1;
                    //console.log('Motor: running_down - position:' + position);
                    process.nextTick(() => {emitter.emit('pos', position)});
                    timeoutId = setTimeout(signalPosition, positionTimeout);
                    if (position <= 0) {
                        //console.log('in bottom position');
                        position = 0;
                        sm.transfer(stopped);
                    }
                    break;
                default:
                    //console.log('!!! running_down - Unhandled signal: ' + event.signal);
                    break;
            }
        },
        entry(event) {
            //console.log('Motor: Enter running_down');
            state = 'running_down';
            timeoutId = setTimeout(signalPosition, positionTimeout);
        },
        exit(event) {
            //console.log('Motor: Exit running_down ' + new Date().getTime());
            clearTimeout(timeoutId);
        }
    });

    sm.init(stopped);
    process.nextTick(() => {emitter.emit('pos', position)});

    return Object.freeze({
        emitter,
        dispatch: sm.dispatch,
        getState: () => state,
        getPosition: () => position,
        setPosTimeout: (tm) => {positionTimeout = tm}
    });

};

module.exports.Motor = Motor;
