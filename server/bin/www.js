var koa = require('koa'),
	static = require('koa-static'),
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
		this.body = this.status + " - Internal Server Error, ooops :(";

		console.log(err);

	}

});

app.use(logger());
app.use(static(__dirname + '/../../app'));

states.init(app);
controller.init(app);
routing.init(app);


app.on('error', function(err, ctx){

	console.log(err);

});

app.listen(4200);