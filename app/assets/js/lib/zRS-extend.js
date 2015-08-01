$.fn.zRS3('extend', {

	name : 'transition',
	handle : 'slide',

	extend : function(core) {

		var transition = this,
			spacing = core['options'].slideSpacing,
			visibleSlides = core['options'].visibleSlides,
			publicF = core.ins['publicF'],
			maxPercentage = -100, start = 0, total, percent = 0, speedTimeout, startMomentum = 0, restingPos = -0.0001, slideCount, startPos, remaining;

		transition.setUp = function() {

			slideCount = publicF.slideCount();

			core['elem']['slides'].wrapAll('<div class="carousel" />');

			core['elem']['carousel'] = core['self'].find('.carousel');
			core['elem']['carousel'].css({

				'width' : ((100 * slideCount) / visibleSlides) + '%',
				'float' : 'left',
				'position' : 'relative',
				'transform' : 'translate3d(0%, 0, 0)'

			});
			
			core['elem']['slides'].css({

				'width' : (100 / slideCount) - spacing + '%',
				'display' : 'block'

			});

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				slide.css({

					'left' : (100 / slideCount) * i + '%',
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

		transition.progress = function(pos, startTime, interval, inc) {

			inc = (inc ? inc : 0);

			var now = Date.now(),
				then = interval;
       			delta = now - then,
       			current = now - startTime;

			var distance = (core['elem']['carousel'].width() / slideCount),
				target = Math.round(Math.abs((startPos - distance) + (distance / 2))),
				totalDistance = (target + startPos) * 2,
				speed = (totalDistance / (core['options'].speed * 2) * core['options'].slideBy),
				increment = (transition.easeOut(current, 0, totalDistance, core['options'].speed) - inc) / 2;
				inc = transition.easeOut(current, 0, totalDistance, core['options'].speed);
				remaining = Math.floor((restingPos + target) * 100) / 100;

       		pos -= Math.round(increment * 100) / 100;

       		// console.log(target);
			

			transition.animate = requestAnimationFrame(function() {

				restingPos = pos;
				then = now;

				transition.coordinate(restingPos);

				if(Math.min(inc, totalDistance) === totalDistance) {

					cancelAnimationFrame(transition.animate);
					return;
					
				}

				transition.progress(restingPos, startTime, now, Math.min(inc, totalDistance));

			});

		}

		transition.forward = function(difference) {

			var visibleSlides = visibleSlides,
				slideCount = slideCount;

			if(core['ins'].cssSupport === true) {

				if(publicF.currentSlide() === 1) restingPos = -0.001;

				transition.coordinate(restingPos);

				transition.animate = requestAnimationFrame(function() {

					startPos = restingPos;

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

				if(publicF.currentSlide() === (publicF.slideCount -1)) restingPos = 0.001;

				transition.animate = requestAnimationFrame(function() {

					cancelAnimationFrame(transition.animate);
					transition.progress(restingPos, Date.now(), Date.now(), true);

				});

			} else {

				for(var i = 0; i > difference; i--) {

					publicF.reIndex();
					core['elem']['slides'].eq(slideCount -1).prependTo(core['elem']['carousel']);

				}
				
				core['elem']['carousel'].css({

					'left' : ((100 * difference) - ((spacing * slideCount) * Math.abs(difference))) / visibleSlides + '%'

				});

				core['elem']['carousel'].animate({

					'left' : '0%'

				}, core['options'].speed);

			}

		}

		transition.adjustments = function(pos) {

			var posPer = (Math.round(pos * 100) / 100);

			core['elem']['carousel'].css({

				'transform' : 'translate3d('+ posPer +'%, 0, 0)'

			});

			transition.slidePos(pos);

		}

		transition.slidePos = function(pos) {

			for(var i = 0; i < core['elem']['slides'].length; i++) {

				var slide = core['elem']['slides'].eq(i);

				if(pos < -Math.abs((100 / slideCount) * (i + 1)) && pos <= 0) {

					var finalPos = ((100 / slideCount) * i) - maxPercentage;

				} else {

					var finalPos = (100 / slideCount) * i;

				}

				slide.css({

					'left' : finalPos + '%'

				});

			}

		}

		transition.coordinate = function(posX) {

			total = (posX - (start - (restingPos ? restingPos : 0)));
			percent = Math.round(((total / core['elem']['carousel'].width()) * 100) * 100) / 100;

			if(Math.max(percent, maxPercentage) === maxPercentage) {

				percent = ((total / core['elem']['carousel'].width()) * 100) - maxPercentage;
				restingPos = 0;

			} else if(percent > 0) {

				percent = ((total / core['elem']['carousel'].width()) * 100) + maxPercentage;

			}

			transition.adjustments(percent);

		}

		transition.easeOut = function(t, b, c, d) { 

			var ts = (t /=d) * t,
				tc = ts * t;
			
			return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 *t);

	// 			t/=d;
	// return b+c*(t);

		}

	}

});