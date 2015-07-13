exports.params = function(page, name, pageString) {

	return {

 		view: page[pageString] ? page[pageString] : page['default'],
 		page: name

	 }

}