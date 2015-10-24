'use strict';

var fs = require('fs'),
    app = require(__core + '/bin/www');

class Config {
            
    static get(config) {
            
        try {

            return require(__app + '/config/' + config + '.json')[0];

        } catch(err) {

            if(app.env === 'development') {
                
                console.log(err);                
                return err;
                
            }

        }

    }
    
    static delete(config) {
        
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

module.exports = Config;