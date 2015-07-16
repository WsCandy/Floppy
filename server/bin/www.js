var koa = require('koa'),
	static = require('koa-static'),
	conditional = require('koa-conditional-get'),
	staticCache = require('koa-static-cache'),
	etag = require('koa-etag'),
	controller = require('../controller'),
	routing = require('../routing'),
	states = require(__dirname+'/../../app/controller/states/states.js')
	logger = require('koa-logger');

var app = module.exports = koa();

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

var files = {};

app.use(logger());
app.use(staticCache(__dirname + '/../../app'), {

	maxAge: 24 * 60 * 60

});
app.use(static(__dirname + '/../../app'));
app.use(conditional());
app.use(etag());

controller.init(app);
states.init(app, routing);
routing.init(app);


app.on('error', function(err, ctx){

	console.log(err);

});

app.listen(4200);