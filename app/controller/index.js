exports.params = function(page) {

	return {

		view: page['index'] ? page['index'] : page['default'],
		page: 'index'

	}

}

// exports.post = function *(next) {

// 	try {

// 		yield this.render('index', {

// 	 		view: this.page['index'] ? this.page['index'] : this.page['default'],
// 	 		page: 'index',
// 	 		response: this.request.body

// 	 	});

// 	}

// 	catch(err) {

// 		if(err.syscall === 'open') {

// 			this.body = err.message;

// 		} else {

// 			this.status = 404;

// 		}

// 	}

// }