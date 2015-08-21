var router = require('koa-router')(),
	koaBody = require('koa-body')(),
	page = require(__dirname+'/../app/config/page.json')[0];

var testModule = function(module, param) {

	try {

		require(module);
		return true;

	} catch(err) {

		return false;

	}

}

exports.init = function(app) {

	try {

		var baseController = require('../app/controller/base');
			baseController.init(app, router, koaBody);

	}

	catch(err) {

		console.log(err);

	}

	app.use(function *(next) {
	
		this.set('Vary', 'Accept-Encoding');
	
		if(app.env === 'development') {

			delete require.cache[require.resolve(__dirname+'/../app/config/page.json')];
			page = require(__dirname+'/../app/config/page.json')[0];

		}

		yield next;


		if(this.response.status == 404) {

			yield this.render('404', {

		  		view: page['404'] ? page['404'] : page['default'],
		  		page: 'not-found' 

			});

		}		

	});



	router.redirect('/assets/js/main.min.:time.js', '/assets/js/main.min.js');
	router.redirect('/assets/css/main.:time.css', '/assets/css/main.css');

	router.get('/', function *(next) {

		try {

			var controller = require('../app/controller/index');
				
			try {

				yield this.render('index', controller.params(page, 'index'));

			}

			catch(err) {

				console.log(err);

				if(err.syscall === 'open') {

					this.body = err.message;
					
				} else {

					this.status = 404;

				}
				
			}

		}

		catch(err) {

			try {

				yield this.render('index', {

			 		view: page['index'] ? page['index'] : page['default'],
			 		page: 'index'

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

		
		router.post('/', koaBody, function *(next) {

			this.page = page;
			yield next;

		}, testModule('../app/controller/index') && require('../app/controller/index').post ? require('../app/controller/index').post : function *(next) {

			this.status = 403;
			this.body = this.status + ' ' + this.message + ' - Naughty';
			
			yield next;

		});

	});

	router.get('/:page', function *(next) {

		try {

			var controller = require('../app/controller/'+this.params['page']);
				
			try {

				yield this.render(this.params['page'], controller.params(page, this.params['page']));

			}

			catch(err) {

				console.log(err);

				if(err.syscall === 'open') {

					this.body = err.message;
					
				} else {

					this.status = 404;

				}
				
			}

		} 

		catch(err) {

			try {

				yield this.render(this.params['page'], {

			 		view: page[this.params['page']] ? page[this.params['page']] : page['default'],
			 		page: this.params['page']

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

		router.post('/:page', koaBody, function *(next) {

			this.page = page;
			yield next;

		}, testModule('../app/controller/'+this.params['page']) && require('../app/controller/'+this.params['page']).post ? require('../app/controller/'+this.params['page']).post : function *(next) {

			this.status = 403;
			this.body = this.status + ' ' + this.message + ' - Naughty';
			
			yield next;

		});

	});

	router.get('/:dir/:page', function *(next) {

		var pageArray = [this.params['dir'], this.params['page']],
			pageString = pageArray.join('-');

		try {

			var controller = require('../app/controller/'+this.params['dir'] + '/' + this.params['page']);
				
			yield this.render(this.params['dir'] + '/' + this.params['page'], controller.params(page, this.params['page'], pageString));


		} catch(err) {

			try {
			 
			 	yield this.render(this.params['dir'] + '/' + this.params['page'], {

			 		view: page[pageString] ? page[pageString] : page['default'],
			 		page: pageString

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

	})
	.post('/:dir/:page', koaBody, function *(next) {

		this.body = this.request.body;

	});

	app
		.use(router.routes())
		.use(router.allowedMethods());

}