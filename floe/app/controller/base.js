exports.init = function(app) {

    app.use(function *(next){
        
		this.state.File = __('File');
		
        yield next;

	});

}