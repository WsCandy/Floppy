var fs = require('fs'),
    app = require(__core + '/bin/www');

var File = function() {
        
    var self = this;
    
    self.getContents = function(path) {
            
        try {

            return fs.readFileSync(path, 'utf8');

        } catch(err) {

            if(app.env === 'development') {
                
                return err;
                
            }

        }

    }
    
    self.getTime = function(path) {
                        
        try {

            var data = fs.statSync(path);
            return data.mtime.getTime();


        } catch(err) {

            if(app.env === 'development') {
                
                return err;
                
            }

        }

    }
    
    self.getFiles = function(path) {
        
        try {
            
            var data = fs.readdirSync(path);
                finalFiles = [];

            for (var file in data) {

                var stats = fs.statSync(path+ '/' + data[file]);

                if(stats.isFile()) {

                    finalFiles.push(data[file]);

                }            

            }
            
        } catch(err) {
        
            if(app.env === 'development') {
                
                return err;
                
            }
            
        }
        
        return finalFiles;
        
    }
    
}

module.exports = new File();