"use strict"

const Motor = require('../Server/motor').Motor;
const assert = require('assert');


describe('Test Motor', function() {

    var motor = {};


    describe('#Start', function() {
        before(function() {
            motor = Motor();
        });

        it('should be in \'stopped\' state ', function() {
            assert.strictEqual(motor.getState(), 'stopped');
        });
        it('should be in 0 position', function() {
            assert.strictEqual(motor.getPosition(), 0);
        });
    });

    describe('#Moving up', function() {
        beforeEach(function() {
            motor = Motor();
        });

        it('should get increasing positions', function(done) {
            this.timeout(7000);
            let pos = motor.getPosition();

            motor.onPosition((position) => {
                assert.strictEqual(position - pos, 1);
                pos = position;
                if (pos === 10) {
                    done();
                }
            });
            motor.dispatch({signal: "move_up"});

        });

        describe('should stop moving', function() {

            it('stop in position 3', function(done) {
                this.timeout(2000);

                motor.onPosition((position) => {
                    if (position === 3) {
                        motor.dispatch({signal: "stop"});
                        done();
                    }
                });
                motor.dispatch({signal: "move_up"});
            });

            it('should be in \'stopped\' state ', function() {
                assert.strictEqual(motor.getState(), 'stopped');
            });

        });

        /*
        describe('first floor', function() {
            before(function() {
                lift.dispatch({signal: "floor", data: 1});
            });

            it('current floor should be 1', function() {
                assert.strictEqual(lift.getCurrentFloor(), 1);
            });
            it('should be in \'landing_call\' state ', function() {
                assert.strictEqual(lift.getState(), 'landing_call');
            });
        });

        describe('call floor', function() {
            before(function() {
                lift.dispatch({signal: "floor", data: 2});
            });

            it('current floor should be 2', function() {
                assert.strictEqual(lift.getCurrentFloor(), 2);
            });
            it('should be in \'in_floor\' state ', function() {
                assert.strictEqual(lift.getState(), 'in_floor');
            });


        });
        */
    });

/*
    describe('#in landing floor', function() {
        before(function() {
            lift = Lift();
            lift.dispatch({signal: "landing_call", data: 2});
            lift.dispatch({signal: "floor", data: 2});
            lift.dispatch({signal: "car_call", data: 5});
        });

        it('car call should be 5', function() {
            assert.strictEqual(lift.getCurrentFloor(), 2);
        });
        it('should be in \'car_call\' state ', function() {
            assert.strictEqual(lift.getState(), 'car_call');
        });

    });

    describe('#car call', function() {
        before(function() {
            lift = Lift();
            lift.dispatch({signal: "landing_call", data: 2});
            lift.dispatch({signal: "floor", data: 2});
            lift.dispatch({signal: "car_call", data: 4});
        });

        describe('3rd floor', function() {
            before(function() {
                lift.dispatch({signal: "floor", data: 3});
            });

            it('current floor should be 3', function() {
                assert.strictEqual(lift.getCurrentFloor(), 3);
            });
            it('should be in \'car_call\' state ', function() {
                assert.strictEqual(lift.getState(), 'car_call');
            });
        });

        describe('call floor', function() {
            before(function() {
                lift.dispatch({signal: "floor", data: 4});
            });

            it('current floor should be 4', function() {
                assert.strictEqual(lift.getCurrentFloor(), 4);
            });
            it('should be in \'in_floor\' state ', function() {
                assert.strictEqual(lift.getState(), 'in_floor');
            });
        });

    });
*/

});
