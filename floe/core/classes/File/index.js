'use strict';

var fs = require('fs'),
    app = require(__core + '/bin/www');

class File {
                
    static getContents(path) {
            
        try {

            return fs.readFileSync(path, 'utf8');

        } catch(err) {

            if(app.env === 'development') {
                
                return err;
                
            }

        }

    }
    
    static getTime(path) {
                        
        try {

            let data = fs.statSync(path);
            
            return data.mtime.getTime();


        } catch(err) {

            if(app.env === 'development') {
                
                return err;
                
            }

        }

    }
    
    static getFiles(path) {
        
        try {
            
            var data = fs.readdirSync(path);
                finalFiles = [];

            for (let file in data) {

                let stats = fs.statSync(path+ '/' + data[file]);

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
    
}; 

module.exports = File;