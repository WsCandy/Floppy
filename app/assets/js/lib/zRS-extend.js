$.fn.zRS3('extend', {

	name : 'transition',
	handle : 'slide',

	extend : function(core) {

		var transition = this,
			spacing = core['options'].visibleSlides === 1 ? '0' : core['options'].slideSpacing,
			events = ['webkitTransitionEnd', 'transitionend', 'msTransitionEnd', 'oTransitionEnd'],
			maxPercentage, start = 0, total, currentPos = 0, percent = 0, speedTimeout,	startMomentum = 0, restingPos = 0;

		transition.setUp = function() {

			maxPercentage = -Math.abs((((100 / core.ins['publicF'].slideCount()) + ((spacing) / (core['options'].visibleSlides - 1))) * core.ins['publicF'].slideCount()));

			core['elem']['slides'].wrapAll('<div class="carousel" />');

			core['elem']['carousel'] = core['self'].find('.carousel');
			core['elem']['carousel'].css({

				'width' : ((100 * core.ins['publicF'].slideCount()) / core['options'].visibleSlides) + '%',
				'float' : 'left',
				'position' : 'relative',
				'transform' : 'translate3d(0%, 0, 0)'

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

			if(core['ins'].cssSupport === true) {

				core['elem']['inner'].on('touchstart mousedown', function(e) {
					
					cancelAnimationFrame(transition.animate);
					core.objs['controls'].pause();

					restingPos = parseInt(core['elem']['carousel'].css('transform').split(',')[4]);
					e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

					start = e.pageX;
					startMomentum = e.pageX;

					$('body').addClass('no-select');

					core['elem']['carousel'].addClass('active');

					$(document).on('touchmove mousemove', function(e) {

						e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

						if(core['elem']['carousel'].hasClass('active')) {

							transition.coordinate(e.pageX);

						}

					});

					$(document).on('touchend touchcancel mouseup', function(e) {
						
						e = ("ontouchstart" in document.documentElement) ? e.originalEvent : e;

						if(core['elem']['carousel'].hasClass('active')) {

							restingPos = parseInt(core['elem']['carousel'].css('transform').split(',')[4]);
							start = e.pageX;

							core['elem']['carousel'].removeClass('active');
							clearTimeout(speedTimeout);

							var distance = Math.abs(e.pageX - startMomentum),
								speed = Math.round((distance / 75) * 100) / 100;

							$(document).unbind('touchmove mouseup touchend touchcancel');

							$('body').removeClass('no-select');
							
						}

					});

				});

			}

		}

		transition.progress = function(pos, startTime, interval, snap) {

			var now = Date.now(),
				then = interval;
       			delta = now - then,
       			current = now - startTime;

			percent = ((pos / core['elem']['carousel'].width()) * 100) * core['options'].visibleSlides;
       	
			var distance = ((core['elem']['carousel'].width() / core.ins['publicF'].slideCount()) + (core['elem']['carousel'].width() * ((spacing + (spacing / core.ins['publicF'].slideCount())) / 100))) / core['options'].visibleSlides,
				speed = distance / core['options'].speed,
				increment = (speed * delta);

       		pos -= increment;

			transition.animate = requestAnimationFrame(function() {

				if(Math.min(current, core['options'].speed) === core['options'].speed) {

					console.log('done');
					cancelAnimationFrame(transition.animate);

					return;
					
				}			

				if(Math.max(percent, maxPercentage) === maxPercentage) {

					pos = 0;

				}

				if(percent > 0) {

					pos = 0;

				}

				restingPos = pos;
				then = now;

				transition.coordinate(pos, snap);
				transition.progress(pos, startTime, now, snap);

			});


		}

		transition.forward = function(difference) {

			var visibleSlides = core['options'].visibleSlides,
				slideCount = core.ins['publicF'].slideCount();

			if(core['ins'].cssSupport === true) {

				transition.animate = requestAnimationFrame(function() {

					cancelAnimationFrame(transition.animate);
					transition.progress(restingPos, Date.now(), Date.now(), true);

				});

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

		transition.adjustments = function(pos, snap) {

			var finalPos = -Math.abs((((100 / core.ins['publicF'].slideCount()) * 1) + ((spacing * 1) / (core['options'].visibleSlides - 1))) * core.ins['publicF'].currentSlide());

			pos = (Math.round(pos * 100) / 100);

			core['elem']['carousel'].css({

				'transform' : 'translate3d('+ (snap === true && Math.max(pos, finalPos) != -0 ? (Math.max(pos, finalPos)) : pos) +'%, 0, 0)'

			});

			transition.slidePos(pos)

		}

		transition.slidePos = function(pos) {

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				if(pos < -Math.abs(((100 / core.ins['publicF'].slideCount()) * (i + 1)) + ((spacing * (i + 1)) / (core['options'].visibleSlides - 1))) && pos <= 0) {

					var finalPos = ((100 / core.ins['publicF'].slideCount()) * (i + core.ins['publicF'].slideCount())) + ((spacing * (i + core.ins['publicF'].slideCount())) / (core['options'].visibleSlides - 1))

				} else {

					var finalPos = ((100 / core.ins['publicF'].slideCount()) * i) + ((spacing * i) / (core['options'].visibleSlides - 1))

				}

				slide.css({

					'left' : finalPos + '%'

				});

			}

		}

		transition.coordinate = function(posX, snap) {

			total = (posX - (start - (restingPos ? restingPos : 0)));
			percent = (total / core['elem']['carousel'].width()) * 100;

			if(Math.max(percent, maxPercentage) === maxPercentage) {

				percent = 0;

			}

			if(percent === 0) {

				percent = ((total / core['elem']['carousel'].width()) * 100) - maxPercentage;

			} else if(percent > 0) {

				percent = ((total / core['elem']['carousel'].width()) * 100) + maxPercentage;

			}

			speedTimeout = setTimeout(function() {

				startMomentum = posX;

			}, 75);

			transition.adjustments(percent, snap);

			currentPos = parseInt(core['elem']['carousel'].css('transform').split(',')[4]);

		}

		transition.easeOut = function(t, b, c, d) {

			t /= d;
			return -c * t*(t-2) + b;

		}

	}

});