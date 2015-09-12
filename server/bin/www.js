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
    rewrite = require(__dirname+'/../../floe/app/config/routes/rewrite.js');

var app = module.exports = koa();

rewrite.init(app);

app.use(logger());
app.use(conditional());
app.use(favicon(__dirname + '/../../favicon.ico'));
app.use(staticCache(__dirname + '/../../httpdocs', {

	maxAge: (1000 * 60 * 60),
	buffer: app.env === 'development' ? false : true,
	gzip: true,
	usePrecompiledGzip: true,
    dynamic: true

}));
app.use(etag());

controller.init(app);
modules.init(app);
routing.init(app);

app.on('error', function(err, ctx){

	console.log(err, ctx);

});

app.listen(4201);