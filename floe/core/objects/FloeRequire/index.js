'use strict';

var app = require(__core + '/bin/www');

var FloeRequire = function(app) {

    var self = this;

    self.test = function(path) {

        try {

            return require(path);

        } catch(err) {

            return false;

        }        

    }

}

module.exports = new FloeRequire(app);