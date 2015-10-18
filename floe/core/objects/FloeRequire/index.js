var FloeRequire = function(path) {

    var self = this;

    this.test = function(path) {

        try {

            return require(path);

        } catch(err) {

            return false;

        }        

    }

}

module.exports = new FloeRequire();