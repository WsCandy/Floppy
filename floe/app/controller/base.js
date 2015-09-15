var fs = require('fs');

exports.init = function(app) {

    app.use(function *(next){

		this.state.images = function(path) {

            var data = fs.readdirSync(process.env.PWD + '/' + path);
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
        
		this.state.fileContents = function(path) {
            
            return fs.readFileSync(process.env.PWD + '/' + path, 'utf8');
            
        };
        
        yield next;
        
	});
    
    app.use(function *(next){

		this.state.lastModified = function(path) {

            var data = fs.statSync(process.env.PWD + '/' + path);
            return data.mtime.getTime();

		}
		
		yield next;	

	});

}