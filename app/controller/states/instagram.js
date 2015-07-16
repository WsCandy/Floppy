var Q = require('q'),
	https = require('https'),
	self = this;

exports.init = function(app) {
	
	app.use(instagram);

}

var instagram = function *(next) {
	
	yield getInstagram(this);
	yield next;

}

var complete = function(data, process) {

	process.state.instagram = data;

}

var getInstagram = function(process) {
	
	var deferred = Q.defer();

	var accessToken = '414143281.467ede5.b2f838f87a0b418e9d1b7fa21a6d7135',
		options = {
		
			hostname: 'api.instagram.com',
			path: '/v1/users/self/media/recent?access_token='+accessToken,
			method: 'GET'

		};

	var request = https.request(options, function(response) {
		
		var body = '';

		console.log(response.statusCode)

		response.on('data', function(data) {

			body += data;

		});

		response.on('end', function() {

			var info = JSON.parse(body).data;
			deferred.resolve(complete(info, process));

		});

		response.on('error', function(err) {

			console.log(err);

		});

	});

	request.end();

	return deferred.promise;

}