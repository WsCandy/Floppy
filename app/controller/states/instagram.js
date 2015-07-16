var request = require('koa-request'),
	Q = require('q'),
	self = this;

var deferred = Q.defer();

exports.init = function(app) {

	app.use(instagram);

}

var instagram = function *(next) {

	yield getInstagram(this);
	yield next;

}

var fetchInsta = function(data, process) {

	process.state.instagram = data;

}

var getInstagram = function *(process) {

	var accessToken = '414143281.467ede5.b2f838f87a0b418e9d1b7fa21a6d7135',
		response = yield request({

		url : 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + accessToken

	});

	console.log('fetch');
	
	var info = JSON.parse(response.body);

	deferred.resolve(fetchInsta(info.data, process));

}