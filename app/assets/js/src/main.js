window.propFuncs = {

	sliders__ready : function() {

		$('.slider').zRS({

			transition: 'fade',
			slideBy: 1

		});

	},

	images__ready : function() {

		var images = $('img[data-src]');

		for(var i = 0; i < images.length; i++) {

			var image = $(images[i]);

			image.attr('src', image.data('src'));

		}

	}

}

window.dispatchEvent(loaded);