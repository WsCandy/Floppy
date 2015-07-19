var Q = require('q'),
	https = require('https'),
	self = this,
	fs = require('fs'),
	cache;

exports.init = function(app, token) {
	
	self.token = token;
	app.use(instagram);

}

var instagram = function *(next) {
	
	yield getInstagram(this);
	yield next;

}

var complete = function(data, process, time) {

	process.state.instagram = data;

	if(!time) {

		fs.writeFile(__dirname+'/../../cache/instagram.json', JSON.stringify(data), function() {

			cache = new Date();
			cache.setMinutes(cache.getMinutes() + 15);
			console.log('Instagram cache set, expires ' + cache)

		});
		
	}

}

var getInstagram = function(process) {
	
	var deferred = Q.defer();
		currentTime = new Date(),
		options = {
		
			hostname: 'api.instagram.com',
			path: '/v1/users/self/media/recent?access_token='+self.token,
			method: 'GET'

		};
	
	if(cache && currentTime.getTime() < cache.getTime()) {

		fs.readFile(__dirname+'/../../cache/instagram.json', {encoding: 'utf8'}, function(err, data) {

			var info = JSON.parse(data);
			deferred.resolve(complete(info, process, currentTime));

		});

	} else {

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

	}

	return deferred.promise;

}