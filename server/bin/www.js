var koa = require('koa'),
	conditional = require('koa-conditional-get'),
	staticCache = require('koa-static-cache'),
	etag = require('koa-etag'),
	controller = require('../controller'),
	routing = require('../routing'),
	favicon = require('koa-favicon'),
	states = require(__dirname+'/../../app/controller/states/states.js')
	logger = require('koa-logger');

var app = module.exports = koa(),
    files = {};

app.use(function *(next) {

	try {

		yield next;

	}

	catch(err) {

		this.status = err.status || 500;
		this.body = this.status + " - Internal Server Error, ooops :(\n\n" + err;

		console.log(err);

	}

});

app.use(logger());

app.use(conditional());
app.use(favicon(__dirname + '/../../favicon.ico'));
app.use(staticCache(__dirname + '/../../app', {

	maxAge: (1000 * 60 * 60),
	buffer: app.env === 'development' ? false : true,
	gzip: true,
	usePrecompiledGzip: true,
    dynamic: true

}, files));

app.use(etag());
controller.init(app);
states.init(app);
routing.init(app);

app.on('error', function(err, ctx){

	console.log(err);

});

app.listen(4200);