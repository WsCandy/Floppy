var self = this;
	self.app;
	self.router;
	self.koaBody;

var forms = function() {

	self.router.post('/validate', self.koaBody, function *(next) {

		this.body = this.request.body;

	});	

}


exports.init = function(app, router, koaBody) {

	self.app = app;
	self.router = router;
	self.koaBody = koaBody;

	forms();

}