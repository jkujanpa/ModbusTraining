
const Lift = require('../Server/lift').Lift;
const assert = require('assert');


describe('Test Lift', function() {

    describe('#Start', function() {
        var lift = {};

        before(function() {
            lift = Lift();
        });

        it('should be in \'free\' state ', function() {
            assert.strictEqual(lift.getState(), 'free');
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


    describe('#call', function() {
        var lift = {};

        before(function() {
            lift = Lift();
        });

        describe('#Landing call', function() {
            before(function() {
                lift.dispatch({signal: "landing_call", data: 2});
            });

            it('landing call floor should be 2', function() {
                assert.strictEqual(lift.getLandingCall(), 2);
            });
            it('should be in \'landing_call\' state ', function() {
                assert.strictEqual(lift.getState(), 'landing_call');
            });
            it('should be at landing floor and in \'in_floor\' state ', function(done) {
                this.timeout(500);
                setTimeout(function() {
                    assert.strictEqual(lift.getCurrentFloor(), lift.getLandingCall());
                    assert.strictEqual(lift.getState(), 'in_floor');
                    done();
                }, 400);
            });
        });

        describe('#car call', function() {
            before(function() {
                lift.dispatch({signal: "car_call", data: 4});
            });

            it('car call floor should be 4', function() {
                assert.strictEqual(lift.getCarCall(), 4);
            });
            it('should be in \'car_call\' state ', function() {
                assert.strictEqual(lift.getState(), 'car_call');
            });
            it('should be at called floor and in \'in_floor\' state ', function(done) {
                this.timeout(500);
                setTimeout(function() {
                    assert.strictEqual(lift.getCurrentFloor(), lift.getCarCall());
                    assert.strictEqual(lift.getState(), 'in_floor');
                    done();
                }, 400);
            });
        });
    });

});
