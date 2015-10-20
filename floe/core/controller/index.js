var render = require('koa-ejs'),
    Config = __('Config'),
	site = Config.get('site'),
    app = require(__core + '/bin/www');

exports.init = function() {
    
	render(app, {

        root: __app + '/views',
        layout: 'templates/template',
        cache: (app.env === 'development' ? false : true)

	});

	app.use(function *(next) {

		if(app.env === 'development') {

            Config.delete('site');
			site = Config.get('site');

		}
        
  		this.state.site = site;
		yield next;

	});

}