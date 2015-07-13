var fs = require('fs');

var getImages = function(page) {

	return fs.readdirSync(__dirname + '/../assets/img/hero/'+page);

}

exports.params = function(page) {

	return {

		view: page['index'] ? page['index'] : page['default'],
		page: 'index',
		images: getImages('index')

	}

}

exports.post = function *(next) {

	try {

		yield this.render('index', {

	 		view: this.page['index'] ? this.page['index'] : this.page['default'],
	 		page: 'index',
	 		response: this.request.body

	 	});

	}

	catch(err) {

		if(err.syscall === 'open') {

			this.body = err.message;
			
		} else {

			this.status = 404;

		}

	}

}