var koa = require('koa'),
	conditional = require('koa-conditional-get'),
	staticCache = require('koa-static-cache'),
	etag = require('koa-etag'),
	controller = require('../controller'),
	routing = require('../routing'),
	favicon = require('koa-favicon'),
	modules = require(__dirname+'/../../app/modules/index.js'),
    fs = require('fs'),
	logger = require('koa-logger');

var app = module.exports = koa(),
    files = {},
    cssTime = fs.statSync(__dirname + '/../../app/assets/css/main.css').mtime.getTime(),
    jsTime = fs.statSync(__dirname + '/../../app/assets/js/main.min.js').mtime.getTime(),
    alias = {};

alias['/assets/css/main.'+cssTime+'.css'] = '/assets/css/main.css';
alias['/assets/js/main.min.'+jsTime+'.js'] = '/assets/js/main.min.js';

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
    dynamic: true,
    alias: alias

}, files));

app.use(etag());
controller.init(app);
modules.init(app);
routing.init(app);

app.on('error', function(err, ctx){

	console.log(err);

});

app.listen(4201);