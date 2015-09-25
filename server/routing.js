var router = require('koa-router')(),
	koaBody = require('koa-body')({multipart:true}),
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
        this.set('Content-Type', 'text/html; charset=UTF-8');
        this.set('cache-control', 'private, max-age=0');
        this.set('expires', '-1');
        this.state.cookies = this.cookies;
        this.state.env = app.env;
        
		yield next;

		if(this.response.status >= 400) {

			yield this.render('error', {

		  		view: page['error'] ? page['error'] : page['default'],
		  		page: 'not-found',
                status: this.response.status,
                message: this.response.message

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
        
        yield next;

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
                this.status = 404;        

			}			

		}
        
        yield next;

	});
    
    router.post('/rest/:page', koaBody, function *(next) {

        var controller = testModule('../floe/app/controller/rest/'+this.params['page']);
        
        try {
            
            if(controller.init) {
            
                try {

                    controller.init(router, koaBody, this);

                }

                catch(err) {

                    this.app.emit('error', err, this);

                }

            }
            
        } catch(err) {
            
            this.app.emit('error', err, this);
            this.status = 404;
            
        }
        
        yield next;

    }).get('/rest/:page', function *(next) {
        
        var controller = testModule('../floe/app/controller/rest/'+this.params['page']);
        
        if(controller.init) {
            
            this.status = 405;
            
        } else {
            
            this.status = 404;
            
        }
      
        yield next;
        
    });

	app
		.use(router.routes())
		.use(router.allowedMethods());

}