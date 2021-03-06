"use strict"

const Motor = require('../Server/motor').Motor;
const assert = require('assert');


describe('Test Motor', function() {

    var motor = {};

    before(function() {
        motor = Motor();
        motor.setPosTimeout(50);
    });

    afterEach(function() {
        motor.emitter.removeAllListeners('pos');
    })


    describe('#Start', function() {
        it('should be in \'stopped\' state ', function() {
            assert.strictEqual(motor.getState(), 'stopped');
        });
        it('should be in 0 position', function() {
            assert.strictEqual(motor.getPosition(), 0);
        });
    });

    describe('#Move up', function() {
        it('should get increasing positions', function(done) {
            this.timeout(5000);
            let pos = motor.getPosition();

            motor.emitter.on('pos', (position) => {
                assert.strictEqual(position - pos, 1);
                pos = position;
                if (pos === 10) {
                    done();
                }
            });
            motor.dispatch({signal: "move_up"});
        });
        it('should be in \'stopped\' state after position 10', function() {
            assert.strictEqual(motor.getState(), 'stopped');
        });
    });

    describe('#Moving down', function() {
        it('should get decreasing positions', function(done) {
            this.timeout(5000);
            let pos = motor.getPosition();

            motor.emitter.on('pos', (position) => {
                assert.strictEqual(pos - position, 1);
                pos = position;
                if (pos === 0) {
                    done();
                }
            });
            motor.dispatch({signal: "move_down"});
        });
        it('should be in \'stopped\' state after position 0', function() {
            assert.strictEqual(motor.getState(), 'stopped');
        });
    });

    describe('#stop moving', function() {
        it('stop in position 5', function(done) {
            this.timeout(5000);
            motor.emitter.on('pos', (position) => {
                if (position === 5) {
                    motor.dispatch({signal: "stop"});
                    done();
                }
            });
            motor.dispatch({signal: "move_up"});
        });
        it('should be in \'stopped\' state at position 5 ', function() {
            assert.strictEqual(motor.getState(), 'stopped');
            assert.strictEqual(motor.getPosition(), 5);
        });
        it('stop in position 2', function(done) {
            this.timeout(5000);
            motor.emitter.on('pos', (position) => {
                if (position === 2) {
                    motor.dispatch({signal: "stop"});
                    done();
                }
            });
            motor.dispatch({signal: "move_down"});
        });
        it('should be in \'stopped\' state at position 2', function() {
            assert.strictEqual(motor.getState(), 'stopped');
            assert.strictEqual(motor.getPosition(), 2);
        });
    });

});
