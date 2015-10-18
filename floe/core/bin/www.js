var koa = require('koa'),
    fs = require('fs');

// Set globals

__root = process.env.PWD;
__docs = process.env.PWD + '/httpdocs';
__app = process.env.PWD + '/floe/app';
__core = process.env.PWD + '/floe/core';

// End set globals

var conditional = require('koa-conditional-get'),
	staticCache = require('koa-static-cache'),
	etag = require('koa-etag'),
	controller = require(__core + '/controller/controller'),
	routing = require(__core + '/controller/routing'),
	favicon = require('koa-favicon'),
	modules = require(__core + '/controller/modules.js'),
	logger = require('koa-logger'),
    rewrite = require(__app + '/config/routes/rewrite.js'),
    baseController = require(__app + '/controller/base');

var app = module.exports = koa(),
    cache = __app + '/cache';

if(!fs.existsSync(cache)) {
    
    fs.mkdir(cache)
    
}

rewrite.init(app);

app.use(logger());
app.use(conditional());
app.use(favicon(__root + '/favicon.ico'));
app.use(staticCache(__docs, {

	maxAge: (1000 * 60 * 60),
	buffer: app.env === 'development' ? false : true,
	gzip: true,
	usePrecompiledGzip: true,
    dynamic: true

}));

app.use(etag());

controller.init(app);
baseController.init(app);
modules.init(app);
routing.init(app);

app.on('error', function(err, ctx){

	console.log(err, ctx);
    
    ctx.state.error = err;
    ctx.status = err.status || 500;

});

app.listen(4201);