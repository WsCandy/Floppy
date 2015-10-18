var router = require('koa-router')(),
	koaBody = require('koa-body')({multipart:true}),
	fs = require('fs'),
	page = require(__app + '/config/page.json')[0],
    redirects = require(__app + '/config/routes/redirects.json')[0],
    FloeRequire = require(__core + '/objects/FloeRequire');

exports.init = function(app) {        

	app.use(function *(next) {
        
		if(app.env === 'development') {

			delete require.cache[require.resolve(__app + '/config/page.json')];
			page = require(__app + '/config/page.json')[0];

		}
        
		this.set('Vary', 'Accept-Encoding');
        this.set('Content-Type', 'text/html; charset=UTF-8');
        this.set('cache-control', 'private, max-age=0');
        this.set('expires', '-1');
        this.state.cookies = this.cookies;
        this.state.env = app.env;
        this.state.error = null;
        
        this.__docs = __docs;
        this.__app = __app;
        this.__root = __root;
        this.__core = __core;
    
        for(var redirect in redirects) {
    
            if(this.request.url === redirect) {
            
                this.status = 301;
                this.redirect('back', redirects[redirect]);

            }

        }
        
		yield next;
        
		if(this.response.status >= 400) {
                                            
            this.response.status = (this.response.status === 200 ? 404 : this.response.status);
            
			yield this.render('error', {

		  		view: page['error'] ? page['error'] : page['default'],
		  		page: 'not-found',
                status: this.response.status,
                message: this.response.message

			});

		}		

	});
        
	router.get('/', function *(next) {

		var controller = FloeRequire.test(__app + '/controller/index');
		
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

		});

	});

	router.get('/:page', function *(next) {

		var controller = FloeRequire.test(__app + '/controller/'+this.params['page']);

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

	});
    
    router.post('/rest/:page', koaBody, function *(next) {

        var controller = FloeRequire.test(__app + '/controller/rest/'+this.params['page']);
        
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
        
        var controller = FloeRequire.test(__app + '/controller/rest/'+this.params['page']);
        
        if(controller.init) {
            
            var err = new Error('Method not allowed ' + this.method + ' - ' + this.url);
                        
            this.state.error = err;
            this.app.emit('error', err, this);
            
            this.status = 405;
            
        } else {
            
            var err = ReferenceError('View not found ' + this.method + ' - ' + this.url);
            
            this.state.error = err;
            this.app.emit('error', err, this);
            
            this.status = 404;
            
        }
      
        yield next;
        
    });

	app
		.use(router.routes())
		.use(router.allowedMethods());

}