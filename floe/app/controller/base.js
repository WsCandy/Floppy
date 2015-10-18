var fs = require('fs');

exports.init = function(app) {

    app.use(function *(next){

		this.state.images = function(path) {

            var data = fs.readdirSync(path);
                finalImages = [];

            for (var image in data) {

                path = path.replace('httpdocs/', '');

                finalImages.push('/' + path + '/' + data[image]);

            }

            return finalImages;

		}

		yield next;

	});
    
    app.use(function *(next){
        
        var thread = this;
        
		this.state.fileContents = function(path) {
            
            try {
                
                return fs.readFileSync(path, 'utf8');
                
            } catch(err) {
                
                thread.status = 500;
                thread.state.error = err;
                
                return;
                
            }
            
        };
        
        yield next;
        
	});
    
    app.use(function *(next){

        var thread = this;
        
		this.state.lastModified = function(path) {
                        
            try {
                
                var data = fs.statSync(path);
                return data.mtime.getTime();
                
                
            } catch(err) {
                
                thread.status = 500;
                thread.state.error = err;
                
                return;
                
            }

		}
		
		yield next;	

	});

}