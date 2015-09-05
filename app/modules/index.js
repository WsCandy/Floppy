var config = require(__dirname+'/../config/site.json')[0],
    fs = require('fs')

exports.init = function(app) {
    
    fs.readdir(__dirname, function(err, data) {
        
        if(!err) {
            
            for(var result in data) {
                
                fs.stat(__dirname+'/'+data[result], function(err, folder) {
                    
                    if(folder.isDirectory()) {
                
                        var module = require(__dirname + '/' + data[result]+'/index.js');
                            module.init(app, config);
                        
                    }                    
                    
                });
                
            }
            
        }        
        
    });

}