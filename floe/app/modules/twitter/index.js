var OAuth = require('oauth'),
    Q = require('q'),
    fs = require('fs'),
    config = require(__dirname+'/../../config/site.json')[0],    
	currentTime,
    cache,
	cacheExpire = 2,
    data = [];

var cacheTwitter = function() {
    
    currentTime = new Date();    
    
    var oauth = new OAuth.OAuth(
    
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        'L4E5NrgMI4m8zNNdcjRA',
        'IpxOX4H35yuotXWodqgSgi9jMi8U0gZvTdktv4',
        '1.0A',
        null,
        'HMAC-SHA1'
        
    );
    
    oauth.get(
        
//        'https://api.twitter.com/1.1/statuses/user_timeline.json?count=10&screen_name='+config.twitter,
        'https://api.twitter.com/1.1/search/tweets.json?q=%23pokemon',
        '1219737277-9AnhbsG2MC5JnAfxX6agG2z4MHtuFQGP1BfDM4O',
        '8uqop3rdUhdCnNNUZLhaysfOGEf6SsIXBtIvCtf6ggw',           
        function (err, data, res){            

            var info = JSON.parse(data);
            
            if(!info.errors) {
                
                parseData(info);
                
            } else {
                
                writeCache(info);
                
            }

        }
    
    );
    
//    var request = oauth.get(
//
//        'https://userstream.twitter.com/1.1/user.json',
//        '1219737277-9AnhbsG2MC5JnAfxX6agG2z4MHtuFQGP1BfDM4O',
//        '8uqop3rdUhdCnNNUZLhaysfOGEf6SsIXBtIvCtf6ggw');
//
//    request.addListener('response', function (response) {
//
//        response.setEncoding('utf8');
//        response.addListener('data', function (chunk) {
//            
//            console.log(chunk);
//
//        });
//
//        response.addListener('end', function () {
//
//            console.log('--- END ---');
//
//        });
//
//    });
//
//    request.end();
    
}

exports.init = function() {
    
    app.use(twitter);
    
}

var twitter = function *(next) {
        
    if(config.twitter === null) {
        
        this.state.twitter = null;
        
    } else {
        
        yield getTwitter(this);
        
    }

    yield next;
    
}

var complete = function(data, process, time) {
    
	process.state.twitter = data;
    
	if(!time) {

		writeCache(data);
		
	}

}

var writeCache = function(data) {

	fs.writeFile(__dirname+'/../../cache/twitter.json', JSON.stringify(data), function() {

		cache = new Date();
		cache.setMinutes(cache.getMinutes() + cacheExpire);
		console.log('Twitter cache set, expires ' + cache)

	});

}

var getTwitter = function(process) {
	
	var deferred = Q.defer();

	fs.readFile(__dirname+'/../../cache/twitter.json', {encoding: 'utf8'}, function(err, data) {
        
        try {
            
            var info = JSON.parse(data);
            deferred.resolve(complete(info, process, currentTime));
            
        } catch(err) {
            
            deferred.resolve(complete(null, process, currentTime));
            
        }

	});

	return deferred.promise;

}

var parseData = function(data) {
    
    data = data.statuses;    
    
    for(var tweet in data) {
        
        data[tweet].text = data[tweet].text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i, '<a href="$1" target="_blank" rel="nofollow">$1</a>');
        data[tweet].text = data[tweet].text.replace(/(^|\s)#([A-zÀ-ÿ]+)/g, '$1<a href="https://twitter.com/hashtag/$2" target="_blank" rel="nofollow">#$2</a>');
        data[tweet].text = data[tweet].text.replace(/(^|\s)@([A-zÀ-ÿ]+)/g, '$1<a href="http://www.twitter.com/$2" target="_blank" rel="nofollow">@$2</a>');
        
    }   
    
     writeCache(data);
    
}

if(config.twitter !== null) {
    
    cacheTwitter();
    setInterval(cacheTwitter, 1000 * 60 * cacheExpire);

}