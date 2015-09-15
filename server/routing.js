var router = require('koa-router')(),
	koaBody = require('koa-body')(),
	fs = require('fs'),
	page = require(__dirname+'/../floe/app/config/page.json')[0],
    redirects = require(__dirname+'/../floe/app/config/routes/redirects.json')[0];

var testModule = function(module) {

	try {
		
		return require(module);

	} catch(err) {

		return false;

	}

}

exports.init = function(app) {        

	app.use(function *(next) {
        
		if(app.env === 'development') {

			delete require.cache[require.resolve(__dirname+'/../floe/app/config/page.json')];
			page = require(__dirname+'/../floe/app/config/page.json')[0];

		}
        
		this.set('Vary', 'Accept-Encoding');
        this.state.cookies = this.cookies;
        this.state.env = app.env;
        
		yield next;

		if(this.response.status === 404) {

			yield this.render('404', {

		  		view: page['404'] ? page['404'] : page['default'],
		  		page: 'not-found' 

			});

		}		

	});
    
    for(var redirect in redirects) {
    
        router.redirect(redirect, redirects[redirect]);
        
    }

	router.get('/', function *(next) {

		var controller = testModule('../floe/app/controller/index');
		
		if(controller.params) {
            
            try {
                
                yield this.render('index', controller.params(page, 'index'));
                
            }
            
            catch(err) {
                
                this.app.emit('error', err, this);
                
            }            

		} else {

			try {

				yield this.render('index', {

			 		view: page['index'] ? page['index'] : page['default'],
			 		page: 'index'

			 	});

			}

			catch(err) {

                this.app.emit('error', err, this);

			}		

		}
		
		router.post('/', koaBody, function *(next) {
            
            try {
                
			 this.page = page;
			 yield next;
                
            } 
            
            catch(err) {
                
                this.app.emit('error', err, this);    
                
            }

		}, testModule('../floe/app/controller/index') && require('../floe/app/controller/index').post ? require('../floe/app/controller/index').post : function *(next) {

            try {
                
                this.status = 403;
                this.body = this.status + ' ' + this.message + ' - Naughty';

                yield next;
                
            }
            
            catch(err) {
                
                this.app.emit('error', err, this);
                
            }            

		});

	});

	router.get('/:page', function *(next) {

		var controller = testModule('../floe/app/controller/'+this.params['page']);

		if(controller.params) {
            
            try {
                
                yield this.render(this.params['page'], controller.params(page, this.params['page']));
                
            }
            
            catch(err) {
                
                this.app.emit('error', err, this);
                
            }

		} else {

			try {

				yield this.render(this.params['page'], {

			 		view: page[this.params['page']] ? page[this.params['page']] : page['default'],
			 		page: this.params['page']

			 	});

			}

			catch(err) {

				this.app.emit('error', err, this);

			}			

		}

		router.post('/:page', koaBody, function *(next) {

            try {
                
                this.page = page;
                yield next;
                
            }
            
            catch(err) {
                
                this.app.emit('error', err, this);
                
            }
            
		}, testModule('../floe/app/controller/'+this.params['page']) && require('../floe/app/controller/'+this.params['page']).post ? require('../floe/app/controller/'+this.params['page']).post : function *(next) {

            try {
                
                this.status = 403;
                this.body = this.status + ' ' + this.message + ' - Naughty';

                yield next;
                
            }
            
            catch(err) {
                
                this.app.emit('error', err, this);
                
            }            

		});

	});

	app
		.use(router.routes())
		.use(router.allowedMethods());

}