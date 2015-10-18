var fs = require('fs');

exports.init = function(app) {
    
    var modules = fs.readdirSync(__app + '/modules');
            
    for(var result in modules) {

        var folder = fs.statSync(__app + '/modules/' + modules[result]);
            
        if(folder.isDirectory()) {

            var module = require(__app + '/modules/' + modules[result] + '/index.js');
                module.init(app);

        }

    }

}