$.fn.zRS3('extend', {

	name : 'transition',
	handle : 'slide',

	extend : function(core) {

		var transition = this,
			spacing = core['options'].visibleSlides === 1 ? '0' : core['options'].slideSpacing,
			events = ['webkitTransitionEnd', 'transitionend', 'msTransitionEnd', 'oTransitionEnd'],
			currentPos = 0;

		transition.setUp = function() {

			core['elem']['slides'].wrapAll('<div class="carousel" />');

			core['elem']['carousel'] = core['self'].find('.carousel');
			core['elem']['carousel'].css({

				'width' : ((100 * core.ins['publicF'].slideCount()) / core['options'].visibleSlides) + '%',
				'float' : 'left',
				'position' : 'relative'

			});
			
			core['elem']['slides'].css({

				'width' : ((1 / core.ins['publicF'].slideCount()) * 100) - spacing + '%',
				'display' : 'block'

			});

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				slide.css({

					'left' : ((100 / core.ins['publicF'].slideCount()) * i) + ((spacing * i) / (core['options'].visibleSlides - 1)) + '%',
					'position' : (i === 0 ? 'relative' : 'absolute'),
					'top' : '0px',
					'float' : (i === 0 ? 'left' : 'none')

				});

			}

			var start,
				total,
				currentPos,
				percent,
				maxPercentage = -Math.abs((((100 / core.ins['publicF'].slideCount()) + ((spacing) / (core['options'].visibleSlides - 1))) * core.ins['publicF'].slideCount()));

			if(core['ins'].cssSupport === true) {

				core['elem']['inner'].on('mousedown', function(e) {
					
					currentPos = parseInt(core['elem']['carousel'].css('transform').split(',')[4]);
					start = e.pageX;

					core['elem']['carousel'].addClass('active');

				});

				core['elem']['inner'].on('mousemove', function(e) {

					if(core['elem']['carousel'].hasClass('active')) {

						total = (e.pageX - (start - (currentPos ? currentPos : 0)));
						percent = (total / core['elem']['carousel'].width()) * 100;

						if(Math.max(percent, maxPercentage) === maxPercentage) {

							start = e.pageX;

							total = (e.pageX - start);
							percent = (total / core['elem']['carousel'].width()) * 100;

						}

						transition.adjustments(percent);

					}

				});

				core['elem']['inner'].on('mouseup mouseleave', function(e) {

					if(core['elem']['carousel'].hasClass('active')) {

						// core['objs']['transition'].goTo(Math.abs(target));
						core['elem']['carousel'].removeClass('active');
						
					}

				});

			}

		}

		transition.forward = function(difference) {

			var currentSlide = core.ins['publicF'].currentSlide(),
				visibleSlides = core['options'].visibleSlides,
				slideCount = core.ins['publicF'].slideCount(),
				time;

			if(core['ins'].cssSupport === true) {

				var i = currentPos;

				var animate = function() {

					i+= 0.5;

					currentPos = Math.min(i, (100 / slideCount) * currentSlide + ((spacing * currentSlide / (visibleSlides - 1))));

					core['elem']['carousel'].css({

						'transform' : 'translate3d(-'+ currentPos +'%, 0, 0)'

					});											

					if(i >= (100 / slideCount) * currentSlide + ((spacing * currentSlide / (visibleSlides - 1)))) {

						core['ins'].animationFrame = cancelAnimationFrame(animate);
						return;

					}					

					core['ins'].animationFrame = requestAnimationFrame(animate);

				}

				core['ins'].animationFrame = requestAnimationFrame(animate);

			} else {

				var callback = function() {

					core['elem']['carousel'].css({

						'left' : '0%'

					});

					for(var i = 0; i < difference; i++) {

						core['elem']['slides'].eq(i).appendTo(core['elem']['carousel']);

					}

				}

				core['elem']['carousel'].animate({

					'left' : '-' + ((100 * difference) + ((spacing * slideCount * difference)) / visibleSlides) + '%'

				}, core['options'].speed, callback);				

			}

		}

		transition.back = function(difference) {

			if(core['ins'].cssSupport === true) {



			} else {

				for(var i = 0; i > difference; i--) {

					core.ins['publicF'].reIndex();
					core['elem']['slides'].eq(core.ins['publicF'].slideCount() -1).prependTo(core['elem']['carousel']);

				}
				
				core['elem']['carousel'].css({

					'left' : ((100 * difference) - ((spacing * core.ins['publicF'].slideCount()) * Math.abs(difference))) / core['options'].visibleSlides + '%'

				});

				core['elem']['carousel'].animate({

					'left' : '0%'

				}, core['options'].speed);

			}

		}

		transition.adjustments = function(pos) {

			core['elem']['carousel'].css({

				'transform' : 'translate3d('+ transition.carouselPos(pos) +'%, 0, 0)'

			});
			transition.slidePos(pos)

		}

		transition.slidePos = function(pos) {

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				if(pos < -Math.abs(((100 / core.ins['publicF'].slideCount()) * (i + 1)) + ((spacing * (i + 1)) / (core['options'].visibleSlides - 1)))) {

					var finalPos = ((100 / core.ins['publicF'].slideCount()) * (i + core.ins['publicF'].slideCount())) + ((spacing * (i + core.ins['publicF'].slideCount())) / (core['options'].visibleSlides - 1))

				} else {

					var finalPos = ((100 / core.ins['publicF'].slideCount()) * i) + ((spacing * i) / (core['options'].visibleSlides - 1))

				}

				slide.css({

					'left' : finalPos + '%'

				});

			}


		}

		transition.carouselPos = function(pos) {

			if(pos <= -Math.abs((((100 / core.ins['publicF'].slideCount()) + ((spacing) / (core['options'].visibleSlides - 1))) * core.ins['publicF'].slideCount()))) {

				currentPos = 0;
				return 0;

			} else {

				return pos;

			}

		}

	}

});