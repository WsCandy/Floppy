var Q = require('q'),
	https = require('https'),
	self = this,
	fs = require('fs'),
    config = require(__dirname+'/../../config/site.json')[0],
	cache,
	currentTime,
	cacheExpire = 15;

var cacheInsta = function() {

	currentTime = new Date();
	
	var	options = {
			
        hostname: 'api.instagram.com',
        path: '/v1/users/self/media/recent?access_token='+config['instagram'],
        method: 'GET'

    };

	var request = https.request(options, function(response) {
				
		var body = '';

		response.on('data', function(data) {

			body += data;

		});

		response.on('end', function() {
            
            var info = JSON.parse(body);            
            
			writeCache(info);

		});

		response.on('error', function(err) {

			console.log(err);

		});

	});

	request.end();

}

exports.init = function(app) {
    
	app.use(instagram);

}

var instagram = function *(next) {
    
    if(config.instagram === null) {
        
        this.state.instagram = null;
        
    } else {
        
        yield getInstagram(this);
        
    }
    
    yield next;

}

var complete = function(data, process, time) {

	process.state.instagram = data;

	if(!time) {

		writeCache(data);
		
	}

}

var writeCache = function(data) {

	fs.writeFile(__dirname+'/../../cache/instagram.json', JSON.stringify(data), function() {

		cache = new Date();
		cache.setMinutes(cache.getMinutes() + cacheExpire);
		console.log('Instagram cache set, expires ' + cache)

	});

}

var getInstagram = function(process) {
	
	var deferred = Q.defer();

	fs.readFile(__dirname+'/../../cache/instagram.json', {encoding: 'utf8'}, function(err, data) {

        try {
            
            var info = JSON.parse(data);
            deferred.resolve(complete(info, process, currentTime));
            
        } catch(err) {
            
            deferred.resolve(complete(null, process, currentTime));
            
        }

	});

	return deferred.promise;

}

if(config.instagram !== null) {

    cacheInsta();
    setInterval(cacheInsta, 1000 * 60 * cacheExpire);
    
}