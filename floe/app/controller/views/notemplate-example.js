const View = __('View');

exports.init = function *(page, settings) {

	settings.layout = false;

	yield View.render(page, settings);

};