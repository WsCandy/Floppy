'use strict';

class FloeRequire {

     static test(path) {

        try {

            return require(path);

        } catch(err) {

            return false;

        }        

    }

}

module.exports = FloeRequire;