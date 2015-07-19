exports.params = function(page) {

	return {

		view: page['index'] ? page['index'] : page['default'],
		page: 'index'

	}

}