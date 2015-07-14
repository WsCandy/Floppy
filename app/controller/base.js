var fs = require('fs'),
	events = require('events'),
    eventEmitter = new events.EventEmitter();

var self = this;
	self.app;
	self.router;
	self.koaBody;

var forms = function() {

	self.router.post('/validate', self.koaBody, function *(next) {

		this.body = this.request.body;

	});	

}

var images = function() {

	self.app.use(function *(next){

		var error;

		this.state.images = function(path) {

			console.log(path);

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

		if(error) {

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
	
}