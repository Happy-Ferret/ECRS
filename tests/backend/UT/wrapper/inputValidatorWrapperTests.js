/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 24/09/16
 * Licence: See Readme
 */

/* ************************************* */
/* ********       REQUIRE       ******** */
/* ************************************* */
const {
    assert,
    } = require('chai');
const inputValidatorWrapper = require('../../../../src/wrapper/inputValidatorWrapper');

/* ************************************* */
/* ********        TESTS        ******** */
/* ************************************* */

describe('[UT] inputValidatorWrapper', () => {
    describe('isArraySync', () => {
        it('should return true with Array', () => {
            const input = [];
            const result = inputValidatorWrapper.isArraySync(input);
            assert.isOk(result);
        });

        it('should return false with String', () => {
            const input = '';
            const result = inputValidatorWrapper.isArraySync(input);
            assert.isNotOk(result);
        });

        it('should return false with Boolean', () => {
            const input = true;
            const result = inputValidatorWrapper.isArraySync(input);
            assert.isNotOk(result);
        });

        it('should return false with Integer', () => {
            const input = 10;
            const result = inputValidatorWrapper.isArraySync(input);
            assert.isNotOk(result);
        });

        it('should return false with Null', () => {
            const input = null;
            const result = inputValidatorWrapper.isArraySync(input);
            assert.isNotOk(result);
        });

        it('should return false with Undefined', () => {
            const input = undefined;
            const result = inputValidatorWrapper.isArraySync(input);
            assert.isNotOk(result);
        });

        it('should return false with Object', () => {
            const input = {};
            const result = inputValidatorWrapper.isArraySync(input);
            assert.isNotOk(result);
        });
    });

    describe('isUrlSync', () => {
        it('should return false with Array and mandatory false', () => {
            const input = [];
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Array and mandatory true', () => {
            const input = [];
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Object and mandatory false', () => {
            const input = {};
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Object and mandatory true', () => {
            const input = {};
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Integer (10) and mandatory false', () => {
            const input = 10;
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Integer (10) and mandatory true', () => {
            const input = 10;
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Integer (0) and mandatory false', () => {
            const input = 0;
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Integer (0) and mandatory true', () => {
            const input = 0;
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (false) and mandatory false', () => {
            const input = false;
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (false) and mandatory true', () => {
            const input = false;
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (true) and mandatory false', () => {
            const input = true;
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (true) and mandatory true', () => {
            const input = true;
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return true with Null and mandatory false', () => {
            const input = null;
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isOk(result);
        });

        it('should return false with Null and mandatory true', () => {
            const input = null;
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return true with Undefined and mandatory false', () => {
            const input = undefined;
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isOk(result);
        });

        it('should return false with Undefined and mandatory true', () => {
            const input = undefined;
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'\') and mandatory false', () => {
            const input = '';
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'\') and mandatory true', () => {
            const input = '';
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test\') and mandatory false', () => {
            const input = 'test';
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test\') and mandatory true', () => {
            const input = 'test';
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return true with String (\'http://www.test.com\') and mandatory false', () => {
            const input = 'http://www.test.com';
            const mandatory = false;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isOk(result);
        });

        it('should return true with String (\'http://www.test.com\') and mandatory true', () => {
            const input = 'http://www.test.com';
            const mandatory = true;
            const result = inputValidatorWrapper.isUrlSync(input, mandatory);
            assert.isOk(result);
        });
    });

    describe('isEmailSync', () => {
        it('should return false with Array and mandatory false', () => {
            const input = [];
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Array and mandatory true', () => {
            const input = [];
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Object and mandatory false', () => {
            const input = {};
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Object and mandatory true', () => {
            const input = {};
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Integer (10) and mandatory false', () => {
            const input = 10;
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Integer (10) and mandatory true', () => {
            const input = 10;
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Integer (0) and mandatory false', () => {
            const input = 0;
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Integer (0) and mandatory true', () => {
            const input = 0;
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (false) and mandatory false', () => {
            const input = false;
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (false) and mandatory true', () => {
            const input = false;
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (true) and mandatory false', () => {
            const input = true;
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (true) and mandatory true', () => {
            const input = true;
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return true with Null and mandatory false', () => {
            const input = null;
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isOk(result);
        });

        it('should return false with Null and mandatory true', () => {
            const input = null;
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return true with Undefined and mandatory false', () => {
            const input = undefined;
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isOk(result);
        });

        it('should return false with Undefined and mandatory true', () => {
            const input = undefined;
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'\') and mandatory false', () => {
            const input = '';
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'\') and mandatory true', () => {
            const input = '';
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test\') and mandatory false', () => {
            const input = 'test';
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test\') and mandatory true', () => {
            const input = 'test';
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test@\') and mandatory false', () => {
            const input = 'test@';
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test@\') and mandatory true', () => {
            const input = 'test@';
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test@te\') and mandatory false', () => {
            const input = 'test@te';
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test@te\') and mandatory true', () => {
            const input = 'test@te';
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isNotOk(result);
        });

        it('should return false with String (\'test@test.com\') and mandatory false', () => {
            const input = 'test@test.com';
            const mandatory = false;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isOk(result);
        });

        it('should return false with String (\'test@test.com\') and mandatory true', () => {
            const input = 'test@test.com';
            const mandatory = true;
            const result = inputValidatorWrapper.isEmailSync(input, mandatory);
            assert.isOk(result);
        });
    });

    describe('stringHasMinLength', () => {
        it('should return false with Array and minLength with 4', () => {
            const input = [];
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isNotOk(result);
        });

        it('should return false with Object and minLength with 4', () => {
            const input = {};
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isNotOk(result);
        });

        it('should return false with Integer (10) and minLength with 4', () => {
            const input = 10;
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isNotOk(result);
        });

        it('should return false with Boolean (false) and minLength with 4', () => {
            const input = false;
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isNotOk(result);
        });

        it('should return false with Null and minLength with 4', () => {
            const input = null;
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isNotOk(result);
        });

        it('should return false with Undefined and minLength with 4', () => {
            const input = undefined;
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isNotOk(result);
        });

        it('should return false with String (\'\') and minLength with 4', () => {
            const input = '';
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isNotOk(result);
        });

        it('should return true with String (\'test\') and minLength with 4', () => {
            const input = 'test';
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isOk(result);
        });

        it('should return true with String (\'testtest\') and minLength with 4', () => {
            const input = 'testtest';
            const minLength = 4;
            const result = inputValidatorWrapper.stringHasMinLength(input, minLength);
            assert.isOk(result);
        });
    });
});
