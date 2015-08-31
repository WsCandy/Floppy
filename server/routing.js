var router = require('koa-router')(),
	koaBody = require('koa-body')(),
	fs = require('fs'),
	page = require(__dirname+'/../app/config/page.json')[0];

var testModule = function(module) {

	try {
		
		return require(module);

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
	
        var now = new Date();        
        
		this.set('Vary', 'Accept-Encoding');
	
		if(app.env === 'development') {

			delete require.cache[require.resolve(__dirname+'/../app/config/page.json')];
			page = require(__dirname+'/../app/config/page.json')[0];

		}
        
        this.state.cookies = this.cookies;
        this.state.env = app.env;
        
		yield next;

		if(this.response.status == 404) {

			yield this.render('404', {

		  		view: page['404'] ? page['404'] : page['default'],
		  		page: 'not-found' 

			});

		}		

	});

	router.get('/', function *(next) {

		var controller = testModule('../app/controller/index');
		
		if(controller.params) {

			yield this.render('index', controller.params(page, 'index'));			

		} else {

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

		var controller = testModule('../app/controller/'+this.params['page']);

		if(controller.params) {

			yield this.render(this.params['page'], controller.params(page, this.params['page']));

		} else {

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

	app
		.use(router.routes())
		.use(router.allowedMethods());

}