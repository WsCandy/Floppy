window.propFuncs = {

	isVisible__ready : function() {

		var self = this;

		self.init = function(element) {

			if (!element || 1 !== element.nodeType) return false;

			var html = document.documentElement,
				r = element.getBoundingClientRect(),
				h = html.clientHeight,
				w = html.clientWidth;

			if (!!r && r.bottom >= 0 && r.right >= 0 && r.top <= h && r.left <= w) return true;

		};

		self.init();

	},

	slider_lazy__scroll__ready: function() {
		
		this.scroll = function() {

			if(propCore['isVisible'].init($('.slider')[0]) && $('.slider').data('ins') === undefined) {

				$('.slider').zRS3({

					transition: 'slide',
					slideBy: 1,
					pager: $('.pager'),
					speed: 1000,
					visibleSlides: 1,
					slideSpacing: 0,
					delay: 10000

				});
				
				$('.slider__nav--next').on('click', function() {

					$('.slider').zRS3('next');

				});

				$('.slider__nav--prev').on('click', function() {

					$('.slider').zRS3('prev');

				});

			}		

		}

		this.scroll();

	},

	bg__ready__scroll : function() {

		var self = this;

		self.scroll = function() {

			var bgImg = document.querySelectorAll('.js-bg');

			for(var i = 0; i < bgImg.length; i++) {

				var img = $(bgImg[i]);

				if(propCore['isVisible'].init(bgImg[i])) {

					if(!img.data('img')) continue;

					img.css({

						'background-image' : 'url("' + img.data('img') + '")'

					}).attr('data-img', '');

					if(img.attr('data-img') == '') {
						img.removeAttr('data-img');
					}

				}

			}			

		}

		self.scroll();

	},

	imager__ready : function() {

		return new Imager('.js-imager', {

			lazyload: true

		});

	}

}