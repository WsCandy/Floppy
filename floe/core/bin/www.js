var koa = require('koa'),
    fs = require('fs'),
	favicon = require('koa-favicon'),
    conditional = require('koa-conditional-get'),
	staticCache = require('koa-static-cache'),
	etag = require('koa-etag'),
	logger = require('koa-logger'),
    rewriter = require('koa-rewrite');

// Set globals


__root = process.env.PWD;
__docs = process.env.PWD + '/httpdocs';
__app = process.env.PWD + '/floe/app';
__core = process.env.PWD + '/floe/core';

// End set globals

var app = module.exports = koa(),
    loader = require(__core + '/loader'),
    cache = __app + '/cache';

var controller = require(__core + '/controller/controller'),
	routing = require(__core + '/controller/routing'),
	modules = require(__core + '/controller/modules.js'),
    rewrites = require(__app + '/config/routes/rewrites.json')[0],
    baseController = require(__app + '/controller/base');



if(!fs.existsSync(cache)) {
    
    fs.mkdir(cache)
    
}

for(var rewrite in rewrites) {
        
    var regEx = new RegExp(rewrite);    
    app.use(rewriter(regEx, rewrites[rewrite]))

}

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
    
    console.log('laala');
    
    ctx.state.error = err;
    ctx.status = err.status || 500;

});

app.listen(4201);