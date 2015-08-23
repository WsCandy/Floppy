exports.params = function(page, name) {

	return {

		view: page[name] ? page[name] : page['default'],
		page: name,
		layout: false

	}

}