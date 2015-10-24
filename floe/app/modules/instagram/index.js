'use strict';

var Q = require('q'),
	https = require('https'),
	self = this,
	fs = require('fs'),
    Config = __('Config'),
    site = Config.get('site'),
	cache,
	currentTime,
	cacheExpire = 15;

var cacheInsta = function() {

	currentTime = new Date();
	
	var	options = {
			
        hostname: 'api.instagram.com',
        path: '/v1/users/self/media/recent?access_token='+site['instagram'],
        method: 'GET'

    };

	var request = https.request(options, (response) => {
				
		let body = '';

		response.on('data', (data) => {

			body += data;

		});

		response.on('end', () => {
            
            let info = JSON.parse(body);            
            
			writeCache(info);

		});

		response.on('error', (err) => {

			console.log(err);

		});

	});

	request.end();

}

exports.init = function(app) {
    
	app.use(instagram);

}

var instagram = function *(next) {
    
    if(site.instagram === null) {
        
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

	fs.writeFile(__app + '/cache/instagram.json', JSON.stringify(data), () => {

		cache = new Date();
		cache.setMinutes(cache.getMinutes() + cacheExpire);
		console.log('Instagram cache set, expires ' + cache)

	});

}

var getInstagram = function(process) {
	
	let deferred = Q.defer();

	fs.readFile(__app + '/cache/instagram.json', {encoding: 'utf8'}, (err, data) => {

        try {
            
            let info = JSON.parse(data);
            deferred.resolve(complete(info, process, currentTime));
            
        } catch(err) {
            
            deferred.resolve(complete(null, process, currentTime));
            
        }

	});

	return deferred.promise;

}

if(site.instagram !== null) {

    cacheInsta();
    setInterval(cacheInsta, 1000 * 60 * cacheExpire);
    
}