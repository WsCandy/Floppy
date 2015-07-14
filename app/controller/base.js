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

		var process = this,
			errors;

		this.state.images = function getImages(page, path) {

			fs.readdir(__dirname + '/../'+ (path = (path ? path : 'assets/img/hero/')) + page, function(err, data) {

				if(err) {

					process.status = 500;
					errors = err.message;

				};


				eventEmitter.emit('recievedImages', data, path);

			});

			eventEmitter.on('recievedImages', function(data, path) {

				var finalImages = []

				for (var image in data) {

					finalImages.push('/' + path + '/' +data[image]);

				}

				self.images = finalImages;
		        
		    });			

		    return self.images;

		}

		yield next;

		if(this.status === 500) {

			this.body =  'Error ' + this.status + ' ' + errors;

		}

	});

}

exports.init = function(app, router, koaBody) {

	self.app = app;
	self.router = router;
	self.koaBody = koaBody;

	images();
	
}