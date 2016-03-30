
const Lift = require('../Server/lift').Lift;
const assert = require('assert');


describe('Test Lift', function() {

    var lift = {};


    describe('#Start', function() {
        before(function() {
            lift = Lift();
        });

        it('should be in \'free\' state ', function() {
            assert.strictEqual(lift.getState(), 'free');
        });
        it('there should be 0 persons in ', function() {
            assert.strictEqual(lift.getPersons(), 0);
        });
        it('current floor should be 0', function() {
            assert.strictEqual(lift.getCurrentFloor(), 0);
        });
        it('landing call floor should be 0', function() {
            assert.strictEqual(lift.getLandingCall(), 0);
        });
        it('car call floor should be 0', function() {
            assert.strictEqual(lift.getCarCall(), 0);
        });
    });


    describe('#Landing call', function() {
        before(function() {
            lift = Lift();
        });

        describe('call', function() {
            before(function() {
                lift.dispatch({signal: "landing_call", data: 2});
            });

            it('landing call floor should be 2', function() {
                assert.strictEqual(lift.getLandingCall(), 2);
            });
            it('should be in \'landing_call\' state ', function() {
                assert.strictEqual(lift.getState(), 'landing_call');
            });
        });

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

    });

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

});
