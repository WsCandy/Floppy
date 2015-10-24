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
    cache = __app + '/cache';

__ = function(module) {

    try {

        return require(__core + '/classes/'+ module);

    } catch(err) {

        app.emit('error', err);

    }

};

var controller = require(__core + '/controller'),
	routing = require(__core + '/routes'),
	modules = require(__core + '/modules'),
    rewrites = __('Config').get('routes/rewrites'),
    baseController = require(__core + '/controller/base');

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

app.on('error', (err, ctx) => {

	console.log(err, ctx);
    
    ctx.state.error = err;
    ctx.status = err.status || 500;

});

app.listen(4201);