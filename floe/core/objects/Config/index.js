var fs = require('fs'),
    app = require(__core + '/bin/www');

var Config = function() {
        
    var self = this;
    
    self.get = function(config) {
            
        try {

            return require(__app + '/config/' + config + '.json')[0];

        } catch(err) {

            if(app.env === 'development') {
                
                console.log(err);                
                return err;
                
            }

        }

    }
    
    self.delete = function(config) {
        
        try {
            
            delete require.cache[require.resolve(__app + '/config/' + config + '.json')];
            
        } catch(err) {
            
            if(app.env === 'development') {
                
                console.log(err);
                return err;
                
            }
            
        }
        
    }
    
}

module.exports = new Config();