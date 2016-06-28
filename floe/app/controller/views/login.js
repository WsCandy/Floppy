const View = __('View');

exports.init = function *(config, settings) {

	settings.layout = false;

	yield View.render(settings.page, settings);

};