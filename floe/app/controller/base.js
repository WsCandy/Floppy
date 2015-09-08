var fs = require('fs'),
	Q = require('q');

var self = this;
	self.app;
	self.router;
	self.koaBody;

var images = function() {

	self.app.use(function *(next){

		var error;

		this.state.images = function(path) {

			try {

				var data = fs.readdirSync(__dirname + '/../'+ path),
					finalImages = [];

				for (var image in data) {

					finalImages.push('/' + path + '/' + data[image]);

				}

				self.images = finalImages;

			    return self.images;

			}

			catch (err) {

				error = err.message;

			}

		}

		yield next;

		if(error) {;

			this.status = 500;
			this.body =  'Error ' + this.status + ' ' + error;

		}

	});

}

var lastModified = function() {

	var error;

	self.app.use(function *(next){

		this.state.lastModified = function(path) {
			
			try {

				var data = fs.statSync(__dirname + '/../../../../httpdocs/'+path);
				return data.mtime.getTime();

			}

			catch (err) {

				error = err.message;

			}

		}
		
		yield next;

		if(error) {;

			this.status = 500;
			this.body =  'Error ' + this.status + ' ' + error;

		}			

	});

}

exports.init = function(app, router, koaBody) {

	self.app = app;
	self.router = router;
	self.koaBody = koaBody;

	images();
	lastModified();

}