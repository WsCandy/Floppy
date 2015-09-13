var router = require('koa-router')(),
	koaBody = require('koa-body')(),
	fs = require('fs'),
	page = require(__dirname+'/../floe/app/config/page.json')[0],
    redirects = require(__dirname+'/../floe/app/config/routes/redirects.json')[0];

var errorHandle = function(self, err) {
    
    self.body = err.name + ': ' + err.message;
    
    if(err.code === 'ENOENT' && err.syscall !== 'open') {
        
        self.status = 404;
        
    } else {
        
        self.status = err.status || 500;
        
    }   

    self.app.emit('error', err, self);
    
}

var testModule = function(module) {

	try {
		
		return require(module);

	} catch(err) {

		return false;

	}

}

exports.init = function(app) {

    var baseController = require('../floe/app/controller/base');
        baseController.init(app, router, koaBody);

	app.use(function *(next) {
	
        var now = new Date();        
        
		this.set('Vary', 'Accept-Encoding');
	
		if(app.env === 'development') {

			delete require.cache[require.resolve(__dirname+'/../floe/app/config/page.json')];
			page = require(__dirname+'/../floe/app/config/page.json')[0];

		}
        
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
                
                errorHandle(this, err);
                
            }            

		} else {

			try {

				yield this.render('index', {

			 		view: page['index'] ? page['index'] : page['default'],
			 		page: 'index'

			 	});

			}

			catch(err) {

                errorHandle(this, err);

			}		

		}
		
		router.post('/', koaBody, function *(next) {
            
            try {
                
			 this.page = page;
			 yield next;
                
            } 
            
            catch(err) {
                
                errorHandle(this, err);    
                
            }

		}, testModule('../floe/app/controller/index') && require('../floe/app/controller/index').post ? require('../floe/app/controller/index').post : function *(next) {

            try {
                
                this.status = 403;
                this.body = this.status + ' ' + this.message + ' - Naughty';

                yield next;
                
            }
            
            catch(err) {
                
                errorHandle(this, err);
                
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
                
                errorHandle(this, err);
                
            }

		} else {

			try {

				yield this.render(this.params['page'], {

			 		view: page[this.params['page']] ? page[this.params['page']] : page['default'],
			 		page: this.params['page']

			 	});

			}

			catch(err) {

				errorHandle(this, err);

			}			

		}

		router.post('/:page', koaBody, function *(next) {

            try {
                
                this.page = page;
                yield next;
                
            }
            
            catch(err) {
                
                errorHandle(this, err);
                
            }
            

		}, testModule('../floe/app/controller/'+this.params['page']) && require('../floe/app/controller/'+this.params['page']).post ? require('../floe/app/controller/'+this.params['page']).post : function *(next) {

            try {
                
                this.status = 403;
                this.body = this.status + ' ' + this.message + ' - Naughty';

                yield next;
                
            }
            
            catch(err) {
                
                errorHandle(this, err);
                
            }            

		});

	});

	app
		.use(router.routes())
		.use(router.allowedMethods());

}