var render = require('koa-ejs'),
	config = require(__app + '/config/site.json')[0];

exports.init = function(app) {
    
	render(app, {

        root: __app + '/views',
        layout: 'templates/template',
        cache: (app.env === 'development' ? false : true)

	});    

	app.use(function *(next) {

		if(app.env === 'development') {

			delete require.cache[require.resolve(__app + '/config/site.json')];
			config = require(__app + '/config/site.json')[0];

		}
        
  		this.state.site = config;
		yield next;

	});

}