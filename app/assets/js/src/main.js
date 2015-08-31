window.propFuncs = {

	isVisible__ready: function() {
        
        this.init = function(element, tolerance) {
          
            if(!element || 1 !== element.nodeType) {
                
                return false;
                
            }

            tolerance = tolerance || 0;

            var html = document.documentElement,
                r = element.getBoundingClientRect(),
                h = html.clientHeight,
                w = html.clientWidth;

            if(!!r && (r.bottom - tolerance) >= 0 && r.right >= 0 && (r.top - tolerance) <= h && r.left <= w) {
                
                return true;
                
            }
            
        };

    },
    
    zRS__ready: function() {
      
        $('.top-bg').zRS3({

            transition: 'fade',
            speed: 700,
            delay: 7000

        });
        
    },

	slider_lazy__scroll__ready: function() {
		
		this.scroll = function() {

			if(propCore.isVisible.init($('.slider')[0], 200) && $('.slider').data('ins') === undefined) {

				$('.slider').zRS3({

					transition: 'slide',
					slideBy: 1,
					pager: $('.pager'),
					speed: 1000,
					visibleSlides: 1,
					slideSpacing: 0,
					delay: 6000

				});
				
				$('.slider__nav--next').on('click', function() {

					$('.slider').zRS3('next');

				});

				$('.slider__nav--prev').on('click', function() {

					$('.slider').zRS3('prev');

				});

			}		

		};

		this.scroll();

	},

	bg__ready__scroll : function() {

		var self = this,
			bgImg = document.querySelectorAll('.js-bg');

		self.scroll = function() {

			for(var i = 0, l = bgImg.length; i < l; i++) {

				var img = $(bgImg[i]);

				if(propCore.isVisible.init(bgImg[i], 100)) {

					if(!img.data('img')) {
                        
                        continue;
                        
                    }

					img.css({

						'background-image' : 'url("' + img.data('img') + '")'

					}).removeAttr('data-img');

				}

			}			

		};

		self.scroll();

	},

	imager__ready : function() {

		return new Imager('.js-imager', {

			lazyload: true,
            lazyloadOffset : 300

		});

	},
    
    touch__ready : function() {
        
        var self = this,
            cta = $('.square-cta');
        
        self.handler = function() {
            
            var touched = $(this);
            
            if(touched.hasClass('active')) {
                
                touched.removeClass('active');
                
            } else {
                
                touched.addClass('active');
                
            }
            
        }
        
        cta.on('touchend', self.handler);
        cta.on('touchstart', self.handler);
        
    }

};