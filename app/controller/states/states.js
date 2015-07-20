var instagram = require('./instagram.js'),
	config = require(__dirname+'/../../config/site.json')[0];

exports.init = function(app) {

	if(config.instagram) {

		instagram.cacheInsta(config['instagram']);
		instagram.init(app);

	}

}