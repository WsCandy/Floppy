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

var cacheInsta = () => {

	currentTime = new Date();
	
	var	options = {
			
        hostname: 'api.instagram.com',
        path: `/v1/${site['instagram'][0]}/${site['instagram'][1]}/media/recent?access_token=414143281.467ede5.b2f838f87a0b418e9d1b7fa21a6d7135`,
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

exports.init = (app) => {
    
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

var complete = (data, process, time) => {

	process.state.instagram = data;

	if(!time) {

		writeCache(data);
		
	}

}

var writeCache = (data) => {

	fs.writeFile(`${__app}/cache/instagram.json`, JSON.stringify(data), () => {

		cache = new Date();
		cache.setMinutes(cache.getMinutes() + cacheExpire);
		console.log(`Instagram cache set, expires ${cache}`);

	});

}

var getInstagram = (process) => {
	
	let deferred = Q.defer();

	fs.readFile(`${__app}/cache/instagram.json`, {encoding: 'utf8'}, (err, data) => {

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