var render = require('koa-ejs'),
	config = require(__dirname+'/../app/config/site.json')[0];

exports.init = function(app) {

	render(app, {

        root: 'app/views',
        layout: 'templates/template',
        cache: (app.env === 'development' ? false : true),
        open: '<?',
        close: '?>'

	});

	app.use(function *(next) {

		if(app.env === 'development') {

			delete require.cache[require.resolve(__dirname+'/../app/config/site.json')];
			config = require(__dirname+'/../app/config/site.json')[0];

		}

  		this.state.site = config;
		yield next;

	});

}