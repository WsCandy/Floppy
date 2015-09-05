var fs = require('fs');

exports.init = function(app) {
    
    var modules = fs.readdirSync(__dirname);
            
    for(var result in modules) {

        var folder = fs.statSync(__dirname+'/' + modules[result]);
            
        if(folder.isDirectory()) {

            var module = require(__dirname + '/' + modules[result] + '/index.js');
                module.init(app);

        }

    }

}