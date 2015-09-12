var koa = require('koa'),
	conditional = require('koa-conditional-get'),
	staticCache = require('koa-static-cache'),
	etag = require('koa-etag'),
	controller = require('../controller'),
	routing = require('../routing'),
	favicon = require('koa-favicon'),
	modules = require(__dirname+'/../../floe/app/modules/index.js'),
    fs = require('fs'),
	logger = require('koa-logger'),
    rewrite = require('koa-rewrite');

var app = module.exports = koa(),
    files = {},
    cssTime = fs.statSync(__dirname + '/../../httpdocs/assets/css/main.css').mtime.getTime(),
    jsTime = fs.statSync(__dirname + '/../../httpdocs/assets/js/main.min.js').mtime.getTime(),
    alias = {};

app.use(rewrite(/(\/.+)\.(\d+)\.([^.\/]+)/, '$1.$3'));
app.use(function *(next) {

    this.state = {};
    
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
app.use(staticCache(__dirname + '/../../httpdocs', {

	maxAge: (1000 * 60 * 60),
	buffer: app.env === 'development' ? false : true,
	gzip: true,
	usePrecompiledGzip: true,
    dynamic: true

}, files));

app.use(etag());
controller.init(app);
modules.init(app);

routing.init(app);

app.on('error', function(err, ctx){

	console.log(err, ctx);

});

app.listen(4201);